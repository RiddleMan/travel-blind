<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <response>
      <xsl:if test="DirectionsResponse/status/text()!='OK'">
        <error>
          <xsl:value-of select="DirectionsResponse/status" />
        </error>
      </xsl:if>
      <xsl:if test="DirectionsResponse/status/text()='OK'">
        <steps>
          <step>Journey will take <xsl:value-of select="DirectionsResponse/route/leg/duration/text"/></step>
          <step>You must starts at <xsl:value-of select="DirectionsResponse/route/leg/departure_time/text"/></step>
          <step>Distance of whole trip is <xsl:value-of select="DirectionsResponse/route/leg/distance/text"/></step>
          <step>You will be at destination at <xsl:value-of select="DirectionsResponse/route/leg/arrival_time/text"/></step>
          <xsl:for-each select="DirectionsResponse/route/leg/step[./travel_mode/text()='TRANSIT']">
            <xsl:if test="position() = 1">
              <step>Firstly you must go to <xsl:value-of select="transit_details/departure_stop/name"/> and take <xsl:value-of select="transit_details/line/short_name"/><xsl:value-of select="transit_details/line/name"/>.</step>
            </xsl:if>
            <xsl:if test="position() = last() and count(/DirectionsResponse/route/leg/step[./travel_mode/text()='TRANSIT']) > 1">
              <step>Lastly you must go to <xsl:value-of select="transit_details/departure_stop/name"/> and take <xsl:value-of select="transit_details/line/short_name"/><xsl:value-of select="transit_details/line/name"/>.</step>
            </xsl:if>
            <xsl:if test="position() != last() and position() != 1">
              <step>Next you must go to <xsl:value-of select="transit_details/departure_stop/name"/> and take <xsl:value-of select="transit_details/line/short_name"/><xsl:value-of select="transit_details/line/name"/>.</step>
            </xsl:if>

            <step>Transit runs at <xsl:value-of select="transit_details/departure_time/text"/></step>
            <step>You must get out <xsl:value-of select="transit_details/num_stops"/> stops later in <xsl:value-of select="transit_details/arrival_stop/name"/></step>
            <step>It takes approximetaly <xsl:value-of select="duration/text"/> and wil be at <xsl:value-of select="transit_details/arrival_time/text"/></step>
          </xsl:for-each>
          <step>Thank you for your attention!</step>
        </steps>
      </xsl:if>
    </response>
  </xsl:template>
</xsl:stylesheet>
