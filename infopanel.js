const opusData = async (results) => {
    await $.get("./docs/opus-data/fl_ngs.json", async function (json_data) {
        const obj = await json_data.find(element => element.properties.pid === results.attributes.pid);
        if (obj !== undefined) {
            $('#informationdiv').append('Opus Datasheet: <a target="_blank" href=https://www.ngs.noaa.gov/OPUS/getDatasheet.jsp?PID=' + results.attributes.pid + '>' + results.attributes.pid + '</a><br>');
        }
    });
}

async function queryInfoPanel(event, results, i) {

    $('#informationdiv').append('<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + event.mapPoint.latitude + ',' + event.mapPoint.longitude + '>Google Street View</a><br><br>');


    if (results.length > 0) {
        // Set append templates for information panel
        for (var i = 1; i <= results.length; i++) {
            if (results[i - 1].attributes.layerName === 'USGS Quads') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>USGS Quads</b></p>' +
                    '<b>Quad Name:</b> ' + results[i - 1].attributes.tile_name + '<br>' +
                    '<b> Quad Number: </b>' + results[i - 1].attributes.q_902_83_i + '<br>' +
                    '<b>Latitude, Longitude:</b> ' + results[i - 1].attributes.latitude + ', ' + results[i - 1].attributes.longitude + '<br>' +
                    '<b>Layer Name:</b> ' + results[i - 1].attributes.layerName + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'County_Boundaries_Shoreline') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>County Boundaries</b></p>' +
                    '<b>County Name:</b> ' + results[i - 1].attributes.tigername + '<br>' +
                    '<b>FIPS:</b> ' + results[i - 1].attributes.fips + '<br>' +
                    '<b>Area:</b> ' + results[i - 1].attributes.st_area_shape_ + '<br>' +
                    '<b>Layer Name:</b>County Boundaries<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Soils June 2012 - Dept. of Agriculture') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Soils June 2012 - Dept. of Agriculture</b></p>' +
                    '<b>USDA Soils: </b>' + results[i - 1].attributes.muname + '<br>' +
                    '<b>Mapunit Name:</b> ' + results[i - 1].attributes.muname + '<br>' +
                    '<b>Size (acres):</b> ' + results[i - 1].attributes.muacres + '<br>' +
                    '<b>Texture:</b> ' + results[i - 1].attributes.texture + '<br>' +
                    '<b>Drainage Class:</b> ' + results[i - 1].attributes.drainagecl + '<br>' +
                    '<b>Mapunit Kind:</b> ' + results[i - 1].attributes.mukind + '<br>' +
                    '<b>Flooding Frequency ‐ Dominant Condition:</b> ' + results[i - 1].attributes.flodfreqdc + '<br>' +
                    '<b>Flooding Frequency ‐ Maximum:</b> ' + results[i - 1].attributes.flodfreqma + '<br>' +
                    '<b>Description:</b> ' + results[i - 1].attributes.descript + '<br>',
                );
            } else if (results[i - 1].attributes.layerName === 'Hi-Res Imagery Grid State Plane West') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Hi-Res Imagery - State Plane West<b></b></p>' +
                    '<a target="_blank" href=' + 'http://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=W&gridid=' + results[i - 1].attributes.spw_id + '>' + 'Hi resolution images for ' + results[i - 1].attributes.spw_id + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Hi-Res Imagery Grid State Plane East') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Hi-Res Imagery - State Plane East</b></p>' +
                    '<a target="_blank" href=' + 'http://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=E&gridid=' + results[i - 1].attributes.spe_id + '>' + 'Hi resolution images for ' + results[i - 1].attributes.spe_id + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Hi-Res Imagery Grid State Plane North') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Hi-Res Imagery - State Plane North</b></p>' +
                    '<a target="_blank" href=' + 'http://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=N&gridid=' + results[i - 1].attributes.spn_id + '>' + 'Hi resolution images for ' + results[i - 1].attributes.spn_id + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'NGS Control Points') {


                $('#informationdiv').append('<p style= "font-size: 15px"><b>NGS Control Points</b></p>' +
                    'Control Point Name: ' + results[i - 1].attributes.name + '<br>' +
                    'Latitude, Longitude: ' + results[i - 1].attributes.dec_lat + ', ' + results[i - 1].attributes.dec_long + '<br>' +
                    'County: ' + results[i - 1].attributes.county + '<br>' +
                    'PID: ' + results[i - 1].attributes.pid + '<br>' +
                    'Datasheet: ' + '<a target="_blank" href=' + results[i - 1].attributes.data_srce + '>' + results[i - 1].attributes.pid + '</a><br>' +
                    '<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + results[i - 1].geometry.latitude + ',' + results[i - 1].geometry.longitude + '>Google Street View</a><br>'
                );

                // https://medium.com/netscape/hacking-it-out-when-cors-wont-let-you-be-great-35f6206cc646
                // request GeoJson data from USGS remote server
                var url = 'https://cors-anywhere.herokuapp.com/https://www.ngs.noaa.gov/OPUS/getDatasheet.jsp?PID=' + results[i - 1].attributes.pid;

                // const opusData = async (results) => {
                //     text = await response.text();
                //     if (text.length > 414) {
                //         $('#informationdiv').append('OPUS Datasheet: ' + '<a target="_blank" href=https://www.ngs.noaa.gov/OPUS/getDatasheet.jsp?PID=' + results.attributes.pid + '>' + results.attributes.pid + '</a> <br>');
                //     } else {
                //         console.log('No data returned for OPUS Datasheet');
                //     }
                // }
                // await opusData(results[i - 1]);

                // console.log(results);


                await opusData(results[i - 1]);

            } else if (results[i - 1].attributes.layerName === 'NGS Control Points QueryTask') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>NGS Control Points</b></p>' +
                    'Control Point Name: ' + results[i - 1].attributes.name + '<br>' +
                    'Latitude, Longitude: ' + results[i - 1].attributes.dec_lat + ', ' + results[i - 1].attributes.dec_long + '<br>' +
                    'County: ' + results[i - 1].attributes.county + '<br>' +
                    'PID: ' + results[i - 1].attributes.pid + '<br>' +
                    'Datasheet: ' + '<a target="_blank" href=' + results[i - 1].attributes.datasheet2 + '>' + results[i - 1].attributes.pid + '</a><br>' +
                    '<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + results[i - 1].geometry.latitude + ',' + results[i - 1].geometry.longitude + '>Google Street View</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'City Limits') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>City Limits</b></p>' +
                    '<b>City limits:</b> ' + results[i - 1].attributes.name + '<br>' +
                    '<b>County:</b> ' + results[i - 1].attributes.county + '<br>' +
                    '<b>Object ID:</b> ' + results[i - 1].attributes.objectid + '<br>' +
                    '<b>tax_count:</b> ' + results[i - 1].attributes.tax_count + '<br>' +
                    '<b>Description:</b> ' + results[i - 1].attributes.descript + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Parcels') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Parcels</b></p>' +
                    '<b>County ID:</b> ' + results[i - 1].attributes.CO_NO + '<br>' +
                    '<b>Parcel ID:</b> ' + results[i - 1].attributes.PARCEL_ID + '<br>' +
                    '<b>City:</b> ' + results[i - 1].attributes.PHY_CITY + '<br>' +
                    '<b>Address:</b> ' + results[i - 1].attributes.PHY_ADDR1 + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Preliminary NGS Points') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Preliminary NGS Points</b></p>' +
                    '<b>Designation: </b>' + results[i - 1].attributes.designatio + '<br>' +
                    '<b>Latitude: </b>' + results[i - 1].attributes.latdecdeg + '<br>' +
                    '<b>Longitude: </b>' + results[i - 1].attributes.londecdeg + '<br>' +
                    'Abstract: ' + '<a href=' + results[i - 1].attributes.abstract + '>' + results[i - 1].attributes.l_number + '</a><br>',
                    'Description: ' + '<a href=' + results[i - 1].attributes.description2 + '>' + results[i - 1].attributes.l_number + '</a><br>' +
                    '<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + results[i - 1].geometry.latitude + ',' + results[i - 1].geometry.longitude + '>Google Street View</a>'

                );
            } else if (results[i - 1].attributes.layerName === 'Tide Stations') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Tide Stations</b></p>' +
                    '<b>Tide Station ID: </b>' + results[i - 1].attributes.id + '<br>' +
                    '<b>Tide Station Name: </b>' + results[i - 1].attributes.name + '<br>' +
                    '<b>County: </b>' + results[i - 1].attributes.countyname + '<br>' +
                    '<b>Quad: </b>' + results[i - 1].attributes.quadname + '<br>' +
                    '<b>Status: </b>' + results[i - 1].attributes.status + '<br>' +
                    '<b>MHW (feet): </b>' + results[i - 1].attributes.navd88mhw_ft + '<br>' +
                    '<b>MLW (feet): </b>' + results[i - 1].attributes.navd88mlw_ft + '<br>' +
                    "<b>Steven's ID: </b>" + results[i - 1].attributes.stevens_id + '<br>' +
                    '<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + results[i - 1].geometry.latitude + ',' + results[i - 1].geometry.longitude + '>Google Street View</a><br>'

                );
                // Do not include link to DEP report if the old link is present
                // if (results[i - 1].attributes.report_dep.substring(0, 36) == 'ftp://ftp.labins.org/tide/NewReports') {
                //     $('#informationdiv').append('DEP Report: ' + '<a target="_blank" href=' + results[i - 1].attributes.report_dep + '>' + results[i - 1].attributes.filename + '</a><br>');
                // }
                // // A null value here will return an object, otherwise, number will be returned
                // if (typeof results[i - 1].attributes.navd88mhw_ft != 'object' && results[i - 1].attributes.navd88mlw_ft != 'object') {
                //     // mhw and mlw are null
                //     $('#informationdiv').append(' <a target="_blank" href=https://www.labins.org/survey_data/water/procedures_and_forms/Forms/MHW%20Procedural%20Approval%20-%20Map.pdf><b>MHW Procedural Approval Form if data IS available</b></a><br>');
                // } else {
                //     // mhw and mlw are null
                //     $('#informationdiv').append('<a target="_blank" href=http://labins.org/survey_data/water/procedures_and_forms/Forms/MHW_Procedural_Approval_noelevation.pdf><b>MHW Procedural Approval Form if data IS NOT available</b></a><br>');

                // }
            } else if (results[i - 1].attributes.layerName === 'Tide Interpolation Points') {
                var replaceWhitespace = results[i - 1].attributes.tile_name.replace(" ", "%20");
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Tide Interpolation Points</b></p>' +
                    '<b>Tide Interpolation Points: </b>' + results[i - 1].attributes.iden + '<br>' +
                    '<b>County: </b>' + results[i - 1].attributes.cname + '<br>' +
                    '<b>Quad: </b>' + results[i - 1].attributes.tile_name + '<br>' +
                    '<b>Method: </b>' + results[i - 1].attributes.method + '<br>' +
                    // '<b>MHW (feet): </b>' + results[i - 1].attributes.mhw2_ft + '<br>' +
                    // '<b>MLW (feet): </b>' + results[i - 1].attributes.mlw2_ft + '<br>' +
                    '<b>Station 1: </b>' + results[i - 1].attributes.station1 + '<br>' +
                    '<b>Station 2: </b>' + results[i - 1].attributes.station2 + '<br>' +
                    '<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + results[i - 1].geometry.latitude + ',' + results[i - 1].geometry.longitude + '>Google Street View</a><br>'
                );
                if (results[i - 1].attributes.status_col === "1") {
                    // This is not a tidal point
                } else if (results[i - 1].attributes.status_col === "2") {
                    // The point has data, fill in the report as you are currently doing
                    $('#informationdiv').append('<b>Download Approval Form: </b><a target="_blank" href=http://www.labins.org/survey_data/water/FlexMap_docs/interp_approval_form.cfm?pin=' + results[i - 1].attributes.iden + '&mCountyName=' + results[i - 1].attributes.cname + '&mQuad=' + replaceWhitespace + '&mhw=' + results[i - 1].attributes.mhw2_ft + '&mlw=' + results[i - 1].attributes.mlw2_ft + '>here</a><br>');
                } else if (results[i - 1].attributes.status_col === "3") {
                    // This point needs a study
                    $('#informationdiv').append('This point needs a study. Click <a target="_blank" href=http://www.labins.org/survey_data/water/FlexMap_docs/MHW_Procedures_wo_29_or_88_data_May_2009_with_checklist.pdf>here</a> to open approval form.<br>');
                }
            } else if (results[i - 1].attributes.layerName === 'R-Monuments') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Regional Coastal Monitoring Data</b> </p>' +
                    '<b>Feature ID: </b>' + results[i - 1].attributes.unique_id + '<br>' +
                    '<b>Monument Name: </b>' + results[i - 1].attributes.monument_name + '<br>' +
                    '<b>State Plane Zone: </b>' + results[i - 1].attributes.state_plane_zone + '<br>' +
                    '<b>County: </b>' + results[i - 1].attributes.county + '<br>' +
                    '<b>Latitude: </b>' + results[i - 1].attributes.latitude + '<br>' +
                    '<b>Longitude: </b>' + results[i - 1].attributes.longitude + '<br>' +
                    '<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + results[i - 1].geometry.latitude + ',' + results[i - 1].geometry.longitude + '>Google Street View</a>'
                );
            } else if (results[i - 1].attributes.layerName === 'Erosion Control Line') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Erosion Control Line</b></p>' +
                    '<b>County: </b>' + results[i - 1].attributes.county + '<br>' +
                    '<b>ECL Name: </b>' + results[i - 1].attributes.ecl_name + '<br>' +
                    '<b>MHW: </b>' + results[i - 1].attributes.mhw + '<br>' +
                    '<b>Location: </b>' + results[i - 1].attributes.location + '<br>' +
                    '<b>Download Information: </b>' + '<a target="_blank" href=http://www.labins.org/survey_data/water/ecl_detail.cfm?sel_file=' + results[i - 1].attributes.mhw + '.pdf&fileType=MAP>' + results[i - 1].attributes.mhw + '.pdf</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Survey Benchmarks') {
                var replaceWhitespace = results[i - 1].attributes.FILE_NAME.replace(" ", "%20");
                $('#informationdiv').append('<p style= "font-size: 15px"><b>SWFWMD Survey Benchmarks</b></p>' +
                    '<b>Benchmark Name: </b>' + results[i - 1].attributes.BENCHMARK_NAME + '<br>' +
                    'More Information: </b><a target="_blank" href=http://ftp.labins.org/swfwmd/SWFWMD_control_2013/' + replaceWhitespace + '>' + results[i - 1].attributes.FILE_NAME + '</a><br>' +
                    '<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + results[i - 1].geometry.latitude + ',' + results[i - 1].geometry.longitude + '>Google Street View</a><br>  '
                );

            } else if (results[i - 1].attributes.layerName === 'Township-Range-Section') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>GLO</b> </p>' +
                    '<b>Section-Township-Range: </b>' + results[i - 1].attributes.twnrngsec.substring(8, ) + ' ' + results[i - 1].attributes.twnrngsec.substring(1, 4) + ' ' + results[i - 1].attributes.twnrngsec.substring(5, 8) + '<br>' +
                    '<a target="_blank" href=http://www.labins.org/survey_data/landrecords/landrecords.cfm?town1=' + results[i - 1].attributes.tr_dissolve.substring(0, 2) + '&town2=' + results[i - 1].attributes.tr_dissolve.substring(2, 3) + '&range1=' + results[i - 1].attributes.tr_dissolve.substring(3, 5) + '&range2=' + results[i - 1].attributes.tr_dissolve.substring(5, 6) + '>' + 'Original GLO Survey Plats and Field Notes' + '</a><br>' +
                    '<a target="_blank" href=http://199.73.242.221/Oculus/servlet/shell?command=hitlist&[catalog=6]&[entityType=any]&[searchBy=profile]&[profile=BSM+Office+Files]&[sortBy=Creator]&{STR+Coordinates=%20LK%20S0' + results[i - 1].attributes.tr_dissolve.substring(0, 2) + '%20' + results[i - 1].attributes.twnrngsec.substring(0, 4) + '%20' + results[i - 1].attributes.twnrngsec.substring(4, 8) + '}>' + 'Oculus Database - DEP Use Only' + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Township-Range') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Township</b> </p>' +
                    '<b>Township-Range: </b>' + results[i - 1].attributes.tr_dissolve.substring(0, 3) + ' ' + results[i - 1].attributes.tr_dissolve.substring(3, ) + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Geographic Names') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Geographic Names</b> </p>' +
                    '<b>Feature Name: </b>' + results[i - 1].attributes.feature_na + '<br>' +
                    '<b>Feature Class: </b>' + results[i - 1].attributes.feature_cl + '<br>' +
                    '<a target="_blank" href=http://maps.google.com/maps?q=&layer=c&cbll=' + results[i - 1].geometry.latitude + ',' + results[i - 1].geometry.longitude + '>Google Street View</a>'

                );

            } else if (results[i - 1].attributes.layerName === 'Certified Corners' && results[i - 1].attributes.is_image === 'Y') {
                console.log(results[i - 1].attributes);

                $('#informationdiv').append('<p style= "font-size: 15px"><b>Certified Corners</b></p>' +
                    '<b>BLMID: </b>' + results[i - 1].attributes.blmid + '<br>' +
                    '<b>Quad Name: </b>' + results[i - 1].attributes.tile_name + '<br>' +
                    '<b>Quad Number: </b>' + results[i - 1].attributes.quad_num + '<br>'
                );
                const pdfFiles = new Set([]);
                const imageIds = Object.keys(results[i - 1].attributes);
                const tifFiles = [];
                imageIds.map(prop => {
                    if (prop.startsWith('image') && results[i - 1].attributes[prop].length > 1) {
                        pdfFiles.add(results[i - 1].attributes[prop].slice(-18, -5));
                        tifFiles.push(results[i - 1].attributes[prop]);
                    }
                });
                // convert back to array using spread operator and add to popup
                [...pdfFiles].map(fileName => {
                    $('#informationdiv').append('<b>PDF: </b><a target="_blank" href=https://ftp.labins.org/ccr/bydocno_pdf/' + fileName + '.pdf>' + fileName.slice(6) + '.pdf</a><br>');
                });
                // add .tif files to popup
                tifFiles.map(fileName => {
                    $('#informationdiv').append('<b>Image: </b><a target="_blank" href=' + fileName + '>' + fileName.slice(-12, -4) + '.tif</a><br>');
                });

            } else if (results[i - 1].attributes.layerName === 'Coastal Construction Control Lines') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Coastal Construction Control Lines</b></p>' +
                    '<b>County: </b>' + results[i - 1].attributes.COUNTY + '<br>' +
                    '<b>ECL Name: </b>' + results[i - 1].attributes.YEAR + '<br>' +
                    '<b>MHW: </b>' + results[i - 1].attributes.OBJECTID + '<br>'
                );
            }
            $('#informationdiv').append('<br>');
            $('#informationdiv').append('<button id= "' + i + '" name="zoom" class="btn btn-primary">Zoom to Feature</button>');
            $('#informationdiv').append('<hr>');

        }
    } else {
        $('#informationdiv').append('<p>This query did not return any features</p>');
        $('#infoSpan').html('Information Panel - 0 features found. ');
    }
    if (i == 1) {
        // $('#arraylengthdiv').html((parseInt(i - 1)) + ' feature found.');
        $('#infoSpan').html('Information Panel - ' + (parseInt(i - 1)) + ' feature found.');
    } else {
        $('#infoSpan').html('Information Panel - ' + (parseInt(i - 1)) + ' features found. ');
    }
}