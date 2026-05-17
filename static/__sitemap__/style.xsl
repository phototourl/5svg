<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="s">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>5SVG Sitemap</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 2rem; color: #171717; }
          h1 { font-size: 1.25rem; margin-bottom: 1rem; }
          table { border-collapse: collapse; width: 100%; max-width: 56rem; }
          th, td { border: 1px solid #e5e5e5; padding: 0.5rem 0.75rem; text-align: left; }
          th { background: #f5f5f4; }
          a { color: #15803d; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <xsl:choose>
          <xsl:when test="s:sitemapindex">
            <p>Sitemap index</p>
            <table>
              <tr><th>Sitemap URL</th><th>Last modified</th></tr>
              <xsl:for-each select="s:sitemapindex/s:sitemap">
                <tr>
                  <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                  <td><xsl:value-of select="s:lastmod" /></td>
                </tr>
              </xsl:for-each>
            </table>
          </xsl:when>
          <xsl:otherwise>
            <p>URL set</p>
            <table>
              <tr><th>Page URL</th><th>Last modified</th></tr>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                  <td><xsl:value-of select="s:lastmod" /></td>
                </tr>
              </xsl:for-each>
            </table>
          </xsl:otherwise>
        </xsl:choose>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
