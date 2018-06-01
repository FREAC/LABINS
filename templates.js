var customZoomAction = {
    title: "Zoom to",
    id: "custom-zoom",
    className: "esri-icon-zoom-in-magnifying-glass"
  };


  var NGSpopupTemplate = {
    title: 'NGS Control Points: {name}',
    content: "<p>(Latitude, Longitude): {dec_lat}, {dec_long}</p>" +
      "<p>County: {county}</p>" +
      "<p>PID: {pid}</p>" +
      //"<p>Data Source: <a target='_blank' href={data_srce}>here</a></p>" +
      "<p>Datasheet: <a href={datasheet2}>here</a></p>"
  };

  var NGSIdentifyPopupTemplate = {
    title: 'NGS Control Points: {NAME}',
    content: "<p>(Latitude, Longitude): {DEC_LAT}, {DEC_LONG}</p>" +
      "<p>County: {COUNTY}</p>" +
      "<p>PID: {PID}</p>" +
      "<p>Data Source: <a target='_blank' href={DATA_SRCE}>here</a></p>" +
      "<p>Datasheet: <a href='_blank'{DATASHEET2}>here</a></p>"
  };

  var NGSPreliminaryIdentifypopupTemplate = {
    title: 'Preliminary NGS Control Point',
    content: "<p><b>Designation: {designatio}</b></p>" +
      "<p><b>L-Number: {lnumber}</b></p>" +
      "<p><b>County: {county_}</b></p>" +
      "<p>Datasheet: <a target='_blank' href={pid}>here</a></p>" +
      "<p>Abstract file: <a target='_blank' href={abstract}>here</a></p>" +
      "<p>prn.doc file: <a target='_blank' href={description2}>here</a></p>"
  };

  var NGSPreliminarypopupTemplate = {
    title: 'Preliminary NGS Control Point: {FeatureID}',
    content: "<p><b>Designation: {base_and_survey.sde.Prelim_NGS_12_21_2011b.designatio}</b></p>" +
      "<p><b>Latitude: {base_and_survey.sde.Prelim_NGS_12_21_2011b.latdecdeg}</b></p>" +
      "<p><b>Longitude: {base_and_survey.sde.Prelim_NGS_12_21_2011b.londecdeg}</b></p>" +
      "<p>Abstract: <a target='_blank' href={base_and_survey.sde.PUBLISHED_PRELIMINARY.abstract}>here</a></p>" +
      "<p>Description file: <a target='_blank' href={base_and_survey.sde.PUBLISHED_PRELIMINARY.description2}>here</a></p>"
  };

  // obtain BLMID, QuadName, images
  // https://community.esri.com/community/gis/web-gis/arcgisonline/blog/2017/07/18/conditional-field-display-with-arcade-in-pop-ups
  // for conditional expressions
  var certifiedCornersTemplate = {
    title: 'Certified Corners',
    content: "<p><b>BLMID: </b>{blmid}</p>" +
      "<p>Quad Name: {tile_name}</p>" +  
      "<p><b>Images: </b><a target='_blank' href=http://labins.org/survey_data/landrecords/fromFlexMap_blmid_search.cfm?blmid={blmid}>Here</a></p>"
  };

  //ID, name, county, quad name, status, station 1, station 2, mhw, mlw, stevens id
  var tideStationsTemplate = {
    title: 'Tide Stations: {id}',
    content: "<p><b>ID: {id}</b></p>" +
      "<p>County: {countyname}</p>" +
      "<p>Quad Name: {quadname}</p>" +
      "<p>Status: {status}</p>" +
      "<p>MHW: {navd88mhw_ft}</p>" +
      "<p>MLW: {navd88mlw_ft}</p>" +
      "<p>Steven's ID: {stevens_id}</p>" +
      "<p><b>DEP Report: <a target='_blank' href={report_dep}>here</a></b></p>"
  };

  //ID, county, quad name, method, station 1, station 2, mean high water, mean low water, approval form download
  var tideInterpPointsTemplate = {
    title: 'Tide Interpolation Points: {iden}',
    content: "<p><b>ID: {iden}</b></p>" +
      "<p>County: {cname}</p>" +
      "<p>Quad Name: {tile_name}</p>" +
      "<p>Method: {method}</p>" +
      "<p>MHW: {mhw2_ft}</p>" +
      "<p>MLW: {mlw2_ft}</p>" +
      "<p>Station 1: {station1}</p>" +
      "<p>Station 2: {station2}</p>" +
      "<p>Download Approval Form: <a target='_blank' href=http://www.labins.org/survey_data/water/FlexMap_docs/interp_approval_form.cfm?pin={iden}&mCountyName={cname}&mQuad={tile_name}&mhw={mhw2_ft}&mlw={mlw2_ft}>here</a></p>"
  };

  var rMonumentsTemplate = {
    title: 'Regional Coastal Monitoring Data',
    content: "<p><b>Feature ID: {unique_id}</b></p>" +
      "<p>Monument Name: {monument_name}</p>" +
      "<p>State Plane Zone: {state_plane_zone}</p>" +
      "<p>County: {county}</p>" +
      "<p>Latitude: {latitude}</p>" +
      "<p>Longitude: {longitude}</p>"
  };

  var erosionControlLineTemplate = {
    title: 'Erosion Control Line',
    content: "<p><b>Feature ID: {objectid}</b></p>" +
      "<p>County: {county}</p>" +
      "<p>ECL Name: {ecl_name}</p>" +
      "<p>MHW: {mhw}</p>" +
      "<p>Location: {location}</p>" +
      "<p>Download more information: <a target='_blank' href=http://www.labins.org/survey_data/water/ecl_detail.cfm?sel_file={mhw}.pdf&fileType=MAP>here</a></p>"
  };


  /********************************************************
   * 
   * Geoname Popup Template
   * 
   *******************************************************/


  var geonamesTemplate = {
    title: 'Geographic Names',
    content: "<p><b>Object ID: {OBJECTID}</b></p>" +
      "<p>Feature Name: {feature_na}</p>" +
      "<p>Feature Type: {feature_cl}</p>" +
      "<p>State: {state_alph}</p>" +
      "<p>County: {county_nam}</p>",
  };

  /********************************************************
   * 
   * SWFWMD Benchmark Popup Template
   * 
   *******************************************************/

  var swfwmdLayerPopupTemplate = {
    title: 'SWFWMD Survey Benchmarks',
    content: "<p><b>Benchmark Name: {BENCHMARK_NAME}</b></p>" +
      "<p>More Information: <a target='_blank' href=http://ftp.labins.org/swfwmd/SWFWMD_control_2013/{FILE_NAME}>here</a></a></p>"
  };



  /********************************************************
  * 
  * Control Lines Popups
  * 
  *******************************************************/


  // I think I need to add more templates to this
  //municipal name, muacres, texture, drainage class, mukind, floodfreqdc,floodfreqma, description 
  //https://www.fgdl.org/metadata/metadata_archive/fgdl_html/nrcs_soils.htm
  //full key list for abbreviations
  var soilsTemplate = {
    title: 'USDA Soils: {muname}',
    content: "<p><b>Mapunit Name: {muname}</b></p>" +
      "<p>Size (acres): {muacres}</p>" +
      "<p>Texture: {texture}</p>" +
      "<p>Drainage Class: {drainagecl}</p>" +
      "<p>Mapunit Kind: {mukind}</p>" +
      "<p>Flooding Frequency ‐ Dominant Condition: {flodfreqdc}</p>" +
      "<p>Flooding Frequency ‐ Maximum: {flodfreqma}</p>" +
      "<p>Description: {descript}</p>",

    actions: [customZoomAction]
  };
  soilsTemplate.overwriteActions = true;
//This one for popup
  var parcelTemplate = {
    title: 'Parcels: {objectid}',
    content:
      "<p>Parcel ID: {parcel_id}</p>" +
      "<p>City: {own_city}</p>" +
      "<p>State: {own_state}</p>" +
      "<p>Address: {phy_addr1}</p>"
  };
  parcelTemplate.overwriteActions = true;

//This one for identifytask
  var parcelsIdentifyTemplate = {
    title: 'Parcels: {OBJECTID}',
    content:
      "<p>Parcel ID: {PARCEL_ID}</p>" +
      "<p>City: {OWN_CITY}</p>" +
      "<p>State: {OWN_STATE}</p>" +
      "<p>Address: {PHY_ADDR1}</p>"
  };
  parcelsIdentifyTemplate.overwriteActions = true;

  var cityLimitsTemplate = { // autocasts as new PopupTemplate()
    title: "City name: {name}",
    content: "<b>county:</b> {county}'</p>'" +
      "<p><b>objectid:</b> {objectid}'</p>'" +
      "<p><b>tax_count:</b> {tax_count}'</p>'" + 
      "<p><b>descript:</b> {descript}'</p>'"
  };

  var countyTemplate = { // autocasts as new PopupTemplate()
    title: "County name: {ctyname}",
    content: "<b>County:</b> {ctyname}" +
      "<br><b>County FIPS:</b> {fips}" +
      "<br><b>County Area:</b> {st_area}"
  };

  var quadsTemplate = { // autocasts as new PopupTemplate()
    title: "Quads",
    content: "<b>Quad Name:</b> {tile_name}" +
      "<br><b>Latitude:</b> {latitude}" +
      "<br><b>Longitude:</b> {longitude}" +
      "<br><b>Quad Value:</b> {quad}"
  };

  var quadsIdentifyTemplate = { // autocasts as new PopupTemplate()
    title: "Quads",
    content: "<b>Quad Name:</b> {tile_name}" +
      "<br><b>Latitude:</b> {latitude}" +
      "<br><b>Longitude:</b> {longitude}" +
      "<br><b>Quad Value:</b> {quad}"
  };

  //blmid, quad name, ccr links
  var CCRTemplate = {
    title: "CCR with Images",
    content:
      "<p>BLMID: {blmid}</p>" +
      "<p>Quad Name: {tile_name}</p>" +
      "<p>Quad Number: {quad_num}</p>" +
      "<p>Image: <a target='_blank' href={image1}>{image1}</a></p>" +
      "<p>Image: <a target='_blank' href={image2}>{image2}</a></p>" +
      "<p>Image: <a target='_blank' href={image3}>{image3}</a></p>",
  };

  // TRS
  var TRSTemplate = {
    title: "Township Range",
    content:
      "<p>Township: {t_ch}</p>"+
      "<p>Range: {r_ch}</p>"+
      "<p>Township, Range: {twnrng}</p>",
  }