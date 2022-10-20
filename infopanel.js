async function queryInfoPanel(results, i, event = false) {
    let count = results.length;
    let removeThisResult = false;    

    if (event.mapPoint) {
        $('#informationdiv').append('<p><a target="_blank" href=https://maps.google.com/maps?q=&layer=c&cbll=' + event.mapPoint.latitude + ',' + event.mapPoint.longitude + '>Google Street View&nbsp</a> <span class="esri-icon-description" data-toggle="tooltip" data-placement="top" title="Please note: if not clicked where there are streets, no imagery will be returned."></span><br><br></p>');
    }

    if (count > 0) {
        for (var i = 1; i <= results.length; i++) {

            if (results[i - 1].attributes.layerName === 'USGS Quads') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>USGS Quads</b></p>' +
                    '<b>Quad Name:</b> ' + results[i - 1].attributes.tile_name + '<br>' +
                    '<b> Quad Number: </b>' + results[i - 1].attributes.wmd_ + '<br>' +
                    '<b>Latitude, Longitude:</b> ' + results[i - 1].attributes.latitude + ', ' + results[i - 1].attributes.longitude + '<br>' +
                    '<b>Layer Name:</b> ' + results[i - 1].attributes.layerName + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'County Boundaries') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>County Boundaries</b></p>' +
                    '<b>County Name:</b> ' + results[i - 1].attributes.ctyname + '<br>' +
                    '<b>FIPS:</b> ' + results[i - 1].attributes.cfips + '<br>' +
                    '<b>Area:</b> ' + results[i - 1].attributes.st_area + '<br>' +
                    '<b>Layer Name:</b> ' + results[i - 1].attributes.layerName + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'County_Boundaries_Shoreline') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>County Boundary</b></p>' +
                    '<b>County Name:</b> ' + results[i - 1].attributes.tigername + '<br>' +
                    '<b>FIPS:</b> ' + results[i - 1].attributes.fips + '<br>'
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
                    '<b>Description:</b> ' + results[i - 1].attributes.descript + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Hi-Res Imagery Grid State Plane West') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Hi-Res Imagery - State Plane West</b></p>' +
                    '<a target="_blank" href=' + 'https://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=W&gridid=' + results[i - 1].attributes.spw_id + '>' + 'Hi resolution images for ' + results[i - 1].attributes.spw_id + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Hi-Res Imagery Grid State Plane East') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Hi-Res Imagery - State Plane East</b></p>' +
                    '<a target="_blank" href=' + 'https://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=E&gridid=' + results[i - 1].attributes.spe_id + '>' + 'Hi resolution images for ' + results[i - 1].attributes.spe_id + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Hi-Res Imagery Grid State Plane North') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Hi-Res Imagery - State Plane North</b></p>' +
                    '<a target="_blank" href=' + 'https://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=N&gridid=' + results[i - 1].attributes.spn_id + '>' + 'Hi resolution images for ' + results[i - 1].attributes.spn_id + '</a><br>'
                );
            } else if ((results[i - 1].attributes.layerName === 'NGS Control Points') || (results[i - 1].attributes.layerName === 'ALL_DATASHEETS')) {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>NGS Control Points</b></p>' +
                    'Control Point Name: ' + results[i - 1].attributes.NAME + '<br>' +
                    'Latitude, Longitude: ' + Number(results[i - 1].attributes.DEC_LAT).toFixed(5) + ', ' + Number(results[i - 1].attributes.DEC_LON).toFixed(5) + '<br>' +
                    'County: ' + results[i - 1].attributes.COUNTY + '<br>' +
                    'PID: ' + '<a target="_blank" href=' + results[i - 1].attributes.DATA_SRCE + '>' + results[i - 1].attributes.PID + '</a><br>'
                );
                var url = 'https://www.ngs.noaa.gov/OPUS/getDatasheet.jsp?PID=' + results[i - 1].attributes.PID;
                const opusData = async (url, result) => {
                	// const response = await fetch(url);
                	// text = await response.text();
                	// if (text.length > 428) { // response always 200, response length will be > 428 if there is an opus point
                		$('#informationdiv').append('OPUS Datasheet: ' + '<a target="_blank" href=https://www.ngs.noaa.gov/OPUS/getDatasheet.jsp?PID=' + result.attributes.PID + '>' + result.attributes.PID + '</a> <br>');
                    // }
                }
                // had to change the queryInfoPanel function to be async in order for the next line to work
                await opusData(url, results[i - 1]);
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
                    'Abstract: ' + '<a href=' + results[i - 1].attributes.abstract + '>' + results[i - 1].attributes.l_number + '</a><br>' +
                    'Description: ' + '<a href=' + results[i - 1].attributes.description2 + '>' + results[i - 1].attributes.l_number + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Tide Stations') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Tide Stations</b></p>' +
                    '<b>Tide Station ID: </b>' + results[i - 1].attributes.id + '<br>' +
                    '<b>Tide Station Name: </b>' + results[i - 1].attributes.name + '<br>' +
                    '<b>County: </b>' + results[i - 1].attributes.countyname + '<br>' +
                    '<b>Quad: </b>' + results[i - 1].attributes.quadname + '<br>' +
                    '<b>Status: </b>' + results[i - 1].attributes.status + '<br>' +
                    "<b>NOAA Tide Report (<i>If available</i>): </b> <a target='_blank' href='https://tidesandcurrents.noaa.gov/datums.html?id=872" + results[i - 1].attributes.id +  "'>872-"  + results[i - 1].attributes.id + "</a><br>" +
                    "<b>For MHW and MLW data, please request: </b> <a target='_blank' href='https://www.labins.org/survey_data/water/procedures_and_forms/Forms/MHW_MLW_RequestForm.pdf'>here</a><br>"
                );
            } else if (results[i - 1].attributes.layerName === 'Tide Interpolation Points') {
                var replaceWhitespace = results[i - 1].attributes.tile_name.replace(/\s+/g, "%20");
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Tide Interpolation Points</b></p>' +
                    '<b>Tide Interpolation Points: </b>' + results[i - 1].attributes.iden + '<br>' +
                    '<b>County: </b>' + results[i - 1].attributes.cname + '<br>' +
                    '<b>Quad: </b>' + results[i - 1].attributes.tile_name + '<br>' +
                    '<b>Method: </b>' + results[i - 1].attributes.method + '<br>' +
                    '<b>MHW: </b>' + results[i - 1].attributes.mhw2_ft + '<br>' +
                    '<b>MLW: </b>' + results[i - 1].attributes.mlw2_ft + '<br>' +
                    '<b>Station 1: </b>' + results[i - 1].attributes.station1 + '<br>' +
                    '<b>Station 2: </b>' + results[i - 1].attributes.station2 + '<br>' +
                    "<b>For MHW and MLW data, please request: </b> <a target='_blank' href='https://www.labins.org/survey_data/water/procedures_and_forms/Forms/MHW_MLW_RequestForm.pdf'>here</a><br>"
                );

            } else if (results[i - 1].attributes.layerName === 'R-Monuments') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Regional Coastal Monitoring Data</b> </p>' +
                    '<b>Feature ID: </b>' + results[i - 1].attributes.unique_id + '<br>' +
                    '<b>Monument Name: </b>' + results[i - 1].attributes.monument_name + '<br>' +
                    '<b>State Plane Zone: </b>' + results[i - 1].attributes.state_plane_zone + '<br>' +
                    '<b>County: </b>' + results[i - 1].attributes.county + '<br>' +
                    '<b>Latitude: </b>' + results[i - 1].attributes.latitude + '<br>' +
                    '<b>Longitude: </b>' + results[i - 1].attributes.longitude + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Erosion Control Line') {
                if (results[i - 1].attributes.ecl_name !== ' ') {
                    $('#informationdiv').append('<p style= "font-size: 15px"><b>Erosion Control Line</b></p>' +
                        '<b>County: </b>' + results[i - 1].attributes.county + '<br>' +
                        '<b>ECL Name: </b>' + results[i - 1].attributes.ecl_name + '<br>' +
                        '<b>MHW: </b>' + results[i - 1].attributes.mhw + '<br>' +
                        '<b>Beginning Range: </b>' + results[i - 1].attributes.begining_r + '<br>' +
                        '<b>Ending Range: </b>' + results[i - 1].attributes.ending_ran + '<br>' +
                        '<b>FDEP Oculus: </b><a target="_blank" href=' + results[i - 1].attributes.survey_lin + '>' + results[i - 1].attributes.ecl_name + '</a><br>' + 
                        '<p><b>NOTE:</b> To download maps, click the ECL name link above. You will be re-directed to DEP\'s website. Click the "Public Oculus Login" Button to Continue to the ECL Download.</p>' +
                        '<img src="./oculus_login.png" width="150" height="100"><br>'
                    );
                } else {
                    count -= 1;
                    removeThisResult = true;
                }
            } else if (results[i - 1].attributes.layerName === 'Survey Benchmarks') {
                var replaceWhitespace = results[i - 1].attributes.FILE_NAME.replace(/\s+/g, "%20");
                $('#informationdiv').append('<p style= "font-size: 15px"><b>SWFWMD Survey Benchmarks</b></p>' +
                    '<b>Benchmark Name: </b>' + results[i - 1].attributes.BENCHMARK_NAME + '<br>' +
                    'More Information: </b><a target="_blank" href=https://ftp.labins.org/swfwmd/SWFWMD_control_2013/' + replaceWhitespace + '>' + results[i - 1].attributes.FILE_NAME + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Township-Range-Section') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>MHW Surveys</b> </p>' +
                    '<b>Section-Township-Range: </b>' + results[i - 1].attributes.twnrngsec.substring(8, ) + ' ' + results[i - 1].attributes.twnrngsec.substring(1, 4) + ' ' + results[i - 1].attributes.twnrngsec.substring(5, 8) + '<br>' +
                    '<a target="_blank" href=https://www.labins.org/survey_data/water/water.cfm?town1=' + results[i - 1].attributes.tr_dissolve.substring(0, 2) + '&town2=' + results[i - 1].attributes.tr_dissolve.substring(2, 3) + '&range1=' + results[i - 1].attributes.tr_dissolve.substring(3, 5) + '&range2=' + results[i - 1].attributes.tr_dissolve.substring(5, 6) + '&sec1=' + results[i - 1].attributes.twnrngsec.substring(8) + '>' + 'Search for MHW Surveys in this section ' + '</a><br><br>' +
                    '<hr>'
                );
                $('#informationdiv').append('<p style= "font-size: 15px"><b>GLO</b> </p>' +
                    '<b>Section-Township-Range: </b>' + results[i - 1].attributes.twnrngsec.substring(8, ) + ' ' + results[i - 1].attributes.twnrngsec.substring(1, 4) + ' ' + results[i - 1].attributes.twnrngsec.substring(5, 8) + '<br>' +
                    '<a target="_blank" href=https://www.labins.org/survey_data/landrecords/landrecords.cfm?town1=' + results[i - 1].attributes.tr_dissolve.substring(0, 2) + '&town2=' + results[i - 1].attributes.tr_dissolve.substring(2, 3) + '&range1=' + results[i - 1].attributes.tr_dissolve.substring(3, 5) + '&range2=' + results[i - 1].attributes.tr_dissolve.substring(5, 6) + '>' + 'Original GLO Survey Plats and Field Notes' + '</a><br>' +
                    '<a target="_blank" href=https://199.73.242.221/Oculus/servlet/shell?command=hitlist&[catalog=6]&[entityType=any]&[searchBy=profile]&[profile=BSM+Office+Files]&[sortBy=Creator]&{STR+Coordinates=%20LK%20S0' + results[i - 1].attributes.tr_dissolve.substring(0, 2) + '%20' + results[i - 1].attributes.twnrngsec.substring(0, 4) + '%20' + results[i - 1].attributes.twnrngsec.substring(4, 8) + '}>' + 'Oculus Database - DEP Use Only' + '</a><br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Township-Range') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Township</b> </p>' +
                    '<b>Township-Range: </b>' + results[i - 1].attributes.tr_dissolve.substring(0, 3) + ' ' + results[i - 1].attributes.tr_dissolve.substring(3, ) + '<br>'
                );
            } else if (results[i - 1].attributes.layerName === 'Geographic Names') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Geographic Names</b> </p>' +
                    '<b>Feature Name: </b>' + results[i - 1].attributes.feature_na + '<br>' +
                    '<b>Feature Class: </b>' + results[i - 1].attributes.feature_cl + '<br>'
                );
            //
            // This is the old way we used to do things.  The block after this comment is the new relatedFeatures strategy
            //
            // } else if (results[i - 1].attributes.layerName === 'Certified Corners') {
            //     $('#informationdiv').append('<p style= "font-size: 15px"><b>Certified Corners</b></p>' +
            //         '<b>BLMID: </b>' + results[i - 1].attributes.blmid + '<br>' +
            //         '<b>Quad Name: </b>' + results[i - 1].attributes.tile_name + '<br>' +
            //         '<b>Quad Number: </b>' + results[i - 1].attributes.quad_num + '<br>'
            //     );
            //     const pdfFiles = new Set([]);
            //     const imageIds = Object.keys(results[i - 1].attributes);
            //     const tifFiles = [];
            //     imageIds.map(prop => {
            //         if (prop.startsWith('image') && results[i - 1].attributes[prop].length > 1) {
            //             pdfFiles.add(results[i - 1].attributes[prop].slice(-18, -5));
            //             tifFiles.push(results[i - 1].attributes[prop]);
            //         }
            //     });
            //     // convert back to array using spread operator and add to popup
            //     [...pdfFiles].map(fileName => {
            //         $('#informationdiv').append('<b>PDF: </b><a target="_blank" href=https://ftp.labins.org/ccr/bydocno_pdf/' + fileName + '.pdf>' + fileName.slice(6) + '.pdf</a><br>');
            //     });
            //     // add .tif files to popup
            //     tifFiles.map(fileName => {
            //         if (parseInt(fileName.slice(-12,-5)) < 110400){
            //             $('#informationdiv').append('<b>Image: </b><a target="_blank" href=' + fileName + '>' + fileName.slice(-12, -4) + '.tif</a><br>');
            //         }
            //     });
            //     // const relatedFeatures = results[i - 1].attributes.relatedFeatures.sort();
            //     // for (relatedFeature in relatedFeatures) {
            //     //     const folderNum = Math.floor(relatedFeatures[relatedFeature] / 10000).toString().padStart(2, '0');
            //     //     const docNum = relatedFeatures[relatedFeature].toString().padStart(7, '0');
            //     //     $('#informationdiv').append('<b>PDF: </b><a target="_blank" href=https://ftp.labins.org/ccr/bydocno_pdf/ccp' + folderNum + '/' + docNum + '.pdf>' + docNum + '.pdf</a><br>');
            //     // }
            // } else if (results[i - 1].attributes.layerName === 'base_and_survey.sde.pls_ptp_master_3857') {
            } else if (results[i - 1].attributes.layerName === 'Certified Corners') {

                $('#informationdiv').append('<p style= "font-size: 15px"><b>Certified Corner</b></p>' +
                    '<b>BLMID: </b>' + results[i - 1].attributes.blmid + '<br>' +
                    '<b>Quad Name: </b>' + results[i - 1].attributes.tile_name + '<br>' +
                    '<b>Quad Number: </b>' + results[i - 1].attributes.quad_num + '<br>'
                );
                const relatedFeatures = results[i - 1].attributes.relatedFeatures.sort(function(a, b) {return b-a});
                for (relatedFeature in relatedFeatures) {
                    const folderNum = Math.floor(relatedFeatures[relatedFeature] / 10000).toString().padStart(2, '0');
                    const docNum = relatedFeatures[relatedFeature].toString().padStart(7, '0');
                    $('#informationdiv').append('<b>PDF: </b><a target="_blank" href=https://ftp.labins.org/ccr/bydocno_pdf/ccp' + folderNum + '/' + docNum + '.pdf>' + docNum + '.pdf</a><br>');
                }
            } else if (results[i - 1].attributes.layerName === 'Coastal Construction Control Lines') {
                $('#informationdiv').append('<p style= "font-size: 15px"><b>Coastal Construction Control Lines</b></p>' +
                    '<b>County: </b>' + results[i - 1].attributes.COUNTY + '<br>' +
                    '<b>CCCL Name: </b>' + results[i - 1].attributes.YEAR + '<br>' +
                    '<b>MHW: </b>' + results[i - 1].attributes.OBJECTID + '<br>' + 
                    '<b>PDF: </b><a href="https://ftp.labins.org/CCCL/combined_PDFs/' + results[i - 1].attributes.COUNTY + '.pdf" target="_blank">' + results[i - 1].attributes.COUNTY + '</a><br>'
                );
            }

            if (removeThisResult == true) {
                removeThisResult = false; // reset the value back to default and move on
            }
            else if (results[i - 1].attributes.layerName !== 'Township-Range' && results[i - 1].attributes.layerName !== 'County_Boundaries_Shoreline' && removeThisResult == false) {
                $('#informationdiv').append('<br>');
                $('#informationdiv').append('<button id= "' + i + '" name="zoom" class="btn btn-primary">Zoom to Feature</button>');
                $('#informationdiv').append('<hr>');
            } else if (results[i - 1].attributes.layerName == 'Township-Range' && results[i - 1].attributes.layerName !== 'County_Boundaries_Shoreline' && removeThisResult == false) {
                $('#informationdiv').append('<br>');
                $('#informationdiv').append('<hr>');
            }

        }
    } else {
        $('#informationdiv').append('<p>This query did not return any features</p>');
        $('#infoSpan').html('Information Panel - 0 features found. ');
    }
    if (count == 1) {
        $('#infoSpan').html('Information Panel - ' + (parseInt(count)) + ' feature found.');
    } else {
        $('#infoSpan').html('Information Panel - ' + (parseInt(count)) + ' features found. ');
    }
}