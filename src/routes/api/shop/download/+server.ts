import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { accessSync, constants } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import { getProductBySlug, collectSvgAssetPaths, isShopEnabled } from "@/lib/shop";
import {
  getOrderByToken,
  bumpDownloadCount,
  isOrderDownloadExpired,
  isOrderDownloadLimitReached,
} from "@/lib/shop/server";
import { getSvgsByCategory } from "@/data";

/**
 * adapter-node serves `static/` from `build/client` in Docker.
 * Local/dev still uses `static/`. Prefer whichever has shop assets.
 */
function resolveShopAssetRoot(): string {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "build", "client"),
    path.join(cwd, "client"),
    path.join(cwd, "static"),
  ];
  for (const dir of candidates) {
    try {
      accessSync(path.join(dir, "shop", "files"), constants.R_OK);
      return dir;
    } catch {
      /* try next */
    }
  }
  return path.join(cwd, "static");
}

export const GET: RequestHandler = async ({ url }) => {
  if (!isShopEnabled()) {
    return json({ error: "Shop is temporarily unavailable" }, { status: 503 });
  }

  const token = url.searchParams.get("order_token")?.trim();
  if (!token) {
    return json({ error: "order_token required" }, { status: 400 });
  }

  const order = await getOrderByToken(token);
  if (!order) {
    return json(
      { error: "Order not found. Please complete checkout again." },
      { status: 404 },
    );
  }
  if (order.status !== "paid") {
    return json({ error: "Payment required" }, { status: 402 });
  }
  if (isOrderDownloadExpired(order)) {
    return json(
      { error: "Download link expired. Contact support@5svg.com" },
      { status: 410 },
    );
  }
  if (isOrderDownloadLimitReached(order)) {
    return json(
      {
        error:
          "Download limit reached for this order. Contact support@5svg.com",
      },
      { status: 429 },
    );
  }

  const product = getProductBySlug(order.productSlug);
  if (!product) {
    return json({ error: "Product not found" }, { status: 404 });
  }

  const zip = new JSZip();
  const root = resolveShopAssetRoot();
  const usedNames = new Set<string>();

  if (product.kind === "craft" && product.files?.length) {
    for (const file of product.files) {
      const rel = file.path.replace(/^\//, "");
      if (!rel.startsWith("shop/files/")) {
        return json({ error: "Invalid craft file path" }, { status: 500 });
      }
      const abs = path.join(root, rel);
      let data: Buffer;
      try {
        data = await readFile(abs);
      } catch {
        continue;
      }
      let filename = file.filename;
      if (usedNames.has(filename)) filename = `${usedNames.size}-${filename}`;
      usedNames.add(filename);
      zip.file(filename, data);
    }
  } else {
    const svgs = getSvgsByCategory(product.category);
    if (svgs.length === 0) {
      return json({ error: "Category empty" }, { status: 404 });
    }

    for (const svg of svgs) {
      const assets = collectSvgAssetPaths(svg);
      for (const assetPath of assets) {
        const rel = assetPath.replace(/^\//, "");
        if (!rel.startsWith("library/")) continue;
        const abs = path.join(root, rel);
        let data: Buffer;
        try {
          data = await readFile(abs);
        } catch {
          continue;
        }
        let filename = path.basename(rel);
        if (usedNames.has(filename)) {
          filename = `${svg.title.replace(/[^\w.-]+/g, "_")}-${filename}`;
        }
        usedNames.add(filename);
        zip.file(filename, data);
      }
    }
  }

  if (usedNames.size === 0) {
    return json({ error: "No files to zip" }, { status: 500 });
  }

  await bumpDownloadCount(token);

  const bytes = await zip.generateAsync({ type: "uint8array" });
  const filename = `${product.slug}.zip`;

  return new Response(bytes, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
};
