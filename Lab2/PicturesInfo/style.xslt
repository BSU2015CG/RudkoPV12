<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">
    <html>
      <body>
        <table border="1">
          <tr bgcolor="#9acd32">
            <th>File Name</th>
            <th>Width</th>
            <th>Height</th>
            <th>DpiX</th>
            <th>DpiY</th>
            <th>Compression Type</th>
          </tr>
          <xsl:for-each select="pictures/picture">
            <tr>
              <td>
                <xsl:value-of select="name"/>
              </td>
              <td>
                <xsl:value-of select="width"/>
              </td>
              <td>
                <xsl:value-of select="height"/>
              </td>
              <td>
                <xsl:value-of select="dpi-x"/>
              </td>
              <td>
                <xsl:value-of select="dpi-y"/>
              </td>
              <td>
                <xsl:value-of select="compression"/>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
