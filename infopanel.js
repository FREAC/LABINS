function queryInfoPanel (results, i) {
    console.log(results);
    // Set append templates for information panel
    for (var i = 1; i < results.length+1; i++) {
        if (results[i-1].attributes.layerName === 'USGS Quads') {
            $('#informationdiv').append('<p><b>USGS Quads</b></p>' + 
                                    '<b>Quad Name:</b> ' + results[i-1].attributes.tile_name + '</p>' + 
                                    '<b> Quad Number: </b>' + results[i-1].attributes.q_902_83_i + '</p>' +
                                    '<p><b>Latitude, Longitude:</b> ' + results[i-1].attributes.latitude + ', ' + results[i-1].attributes.longitude + '</p>' +
                                    '<p><b>Layer Name:</b> ' + results[i-1].attributes.layerName + '</p>' 
                                    );
        } else if (results[i-1].attributes.layerName === 'County Boundaries') {
            $('#informationdiv').append('<p><b>County Boundaries</b></p>' + 
                                    '<p><b>County Name:</b> ' + results[i-1].attributes.ctyname + '</p>' + 
                                    '<p><b>FIPS:</b> ' + results[i-1].attributes.cfips + '</p>' +
                                    '<p><b>Area:</b> ' + results[i-1].attributes.st_area + '</p>' +
                                    '<p><b>Layer Name:</b> ' + results[i-1].attributes.layerName + '</p>'                                  
                                    );
        } else if (results[i-1].attributes.layerName === 'Soils June 2012 - Dept. of Agriculture') {
            $('#informationdiv').append('<p>Soils June 2012 - Dept. of Agriculture<b></b></p>' +
                                    '<p><b>USDA Soils: </b>' + results[i-1].attributes.muname + '</p>' +
                                    '<p><b>Mapunit Name:</b> ' + results[i-1].attributes.muname + '</p>' +
                                    '<p><b>Size (acres):</b> ' + results[i-1].attributes.muacres + '</p>' +
                                    '<p><b>Texture:</b> ' + results[i-1].attributes.texture + '</p>' +
                                    '<p><b>Drainage Class:</b> ' + results[i-1].attributes.drainagecl + '</p>' +
                                    '<p><b>Mapunit Kind:</b> ' + results[i-1].attributes.mukind + '</p>' +
                                    '<p><b>Flooding Frequency ‐ Dominant Condition:</b> ' + results[i-1].attributes.flodfreqdc + '</p>' +
                                    '<p><b>Flooding Frequency ‐ Maximum:</b> ' + results[i-1].attributes.flodfreqma + '</p>' +
                                    '<p><b>Description:</b> ' + results[i-1].attributes.descript + '</p>',       
                                    );
        } else if (results[i-1].attributes.layerName === 'Hi-Res Imagery Grid State Plane West') {
            $('#informationdiv').append('<p>Hi-Res Imagery Grid State Plane West<b></b></p>' +
                                    '<a target="_blank" href=' + 'http://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=W&gridid=' + results[i-1].attributes.spw_id + '>' + 'Hi resolution images for ' + results[i-1].attributes.spw_id +'</a>'
                                    );
        } else if (results[i-1].attributes.layerName === 'Hi-Res Imagery Grid State Plane East') {
            $('#informationdiv').append('<p>Hi-Res Imagery Grid State Plane East<b></b></p>' +
                                    '<a target="_blank" href=' + 'http://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=E&gridid=' + results[i-1].attributes.spe_id + '>' + 'Hi resolution images for ' + results[i-1].attributes.spe_id +'</a>'
                                    );
        } else if (results[i-1].attributes.layerName === 'Hi-Res Imagery Grid State Plane North') {
            $('#informationdiv').append('<p>Hi-Res Imagery Grid State Plane North<b></b></p>' +
                                    '<a target="_blank" href=' + 'http://labins.org/mapping_data/aerials/hi-res_search_from_map.cfm?spzone=N&gridid=' + results[i-1].attributes.spn_id + '>' + 'Hi resolution images for ' + results[i-1].attributes.spn_id +'</a>'
                                    );
        } else if (results[i-1].attributes.layerName === 'NGS Control Points') {
            $('#informationdiv').append('<p><b>NGS Control Points</b></p>' +
                                    'Control Point Name: ' + results[i-1].attributes.NAME + '</p>' +
                                    '<p>Latitude, Longitude: ' + results[i-1].attributes.DEC_LAT + ', ' +  results[i-1].attributes.DEC_LONG + '</p>' +
                                    '<p>County: ' + results[i-1].attributes.COUNTY + '</p>' + 
                                    '<p>PID: ' + results[i-1].attributes.PID + '</p>' + 
                                    '<p>Datasheet: ' + '<a target="_blank" href=' + results[i-1].attributes.DATA_SRCE + '>' + results[i-1].attributes.PID +'</a></p>',
                                    );
        } else if (results[i-1].attributes.layerName === 'NGS Control Points QueryTask') {
            $('#informationdiv').append('<p><b>NGS Control Points</b></p>' +
                                    'Control Point Name: ' + results[i-1].attributes.name + '</p>' +
                                    '<p>Latitude, Longitude: ' + results[i-1].attributes.dec_lat + ', ' +  results[i-1].attributes.dec_long + '</p>' +
                                    '<p>County: ' + results[i-1].attributes.county + '</p>' + 
                                    '<p>PID: ' + results[i-1].attributes.pid + '</p>' + 
                                    '<p>Datasheet: ' + '<a target="_blank" href=' + results[i-1].attributes.datasheet2 + '>' + results[i-1].attributes.pid +'</a></p>',
                                    );
        } else if (results[i-1].attributes.layerName === 'City Limits') {
            $('#informationdiv').append('<p><b>City Limits</b></p>' +
                                    '<p><b>City limits:</b> ' + results[i-1].attributes.name + '</p>' +
                                    '<p><b>County:</b> ' + results[i-1].attributes.county + '</p>' +
                                    '<p><b>Object ID:</b> ' + results[i-1].attributes.objectid + '</p>' +
                                    '<p><b>tax_count:</b> ' + results[i-1].attributes.tax_count + '</p>' + 
                                    '<p><b>Description:</b> ' + results[i-1].attributes.descript + '</p>'   
                                    );
        } else if (results[i-1].attributes.layerName === 'Parcels') {
            $('#informationdiv').append('<p><b>Parcels</b></p>' +
                                    '<p><b>County ID:</b> ' + results[i-1].attributes.CO_NO + '</p>' +
                                    '<p><b>Parcel ID:</b> ' + results[i-1].attributes.PARCEL_ID + '</p>' +
                                    '<p><b>City:</b> ' + results[i-1].attributes.PHY_CITY + '</p>' +
                                    '<p><b>Address:</b> ' + results[i-1].attributes.PHY_ADDR1 + '</p>'
                                    );
        } else if (results[i-1].attributes.layerName === 'Preliminary NGS Points') {
            $('#informationdiv').append('<p><b>Preliminary NGS Points</b></p>' +
                                    '<p><b>Designation: </b>' + results[i-1].attributes.designatio + '</p>' +
                                    '<p><b>Latitude: </b>' + results[i-1].attributes.latdecdeg + '</p>' + 
                                    '<p><b>Longitude: </b>' + results[i-1].attributes.londecdeg + '</p>' +
                                    '<p>Abstract: ' + '<a href=' + results[i-1].attributes.abstract + '>' + results[i-1].attributes.l_number + '</a></p>',
                                    '<p>Description: ' + '<a href=' + results[i-1].attributes.description2 + '>' + results[i-1].attributes.l_number + '</a></p>',
            );
        } else if (results[i-1].attributes.layerName === 'Tide Stations') {
            $('#informationdiv').append('<p><b>Tide Stations</b></p>' +
                                    '<p><b>Tide Station ID: </b>' + results[i-1].attributes.id + '</p>' +
                                    '<p><b>Tide Station Name: </b>' + results[i-1].attributes.name + '</p>' +
                                    '<p><b>County: </b>' + results[i-1].attributes.countyname + '</p>' +
                                    '<p><b>Quad: </b>' + results[i-1].attributes.quadname + '</p>' + 
                                    '<p><b>Status: </b>' + results[i-1].attributes.status + '</p>' +
                                    '<p><b>MHW (feet): </b>' + results[i-1].attributes.navd88mhw_ft + '</p>' +
                                    '<p><b>MLW (feet): </b>' + results[i-1].attributes.navd88mlw_ft + '</p>' +
                                    "<p><b>Steven's ID: </b>" + results[i-1].attributes.stevens_id + '</p>' +
                                    '<p>DEP Report: ' + '<a target="_blank" href=' + results[i-1].attributes.report_dep + '>' + results[i-1].attributes.filename + '</a></p>',
            
                                );
            // A null value here will return an object, otherwise, number will be returned
            if(typeof results[i-1].attributes.navd88mhw_ft != 'object' && results[i-1].attributes.navd88mlw_ft != 'object') {
                // mhw and mlw are null
                $('#informationdiv').append('<p> <a target="_blank" href=http://labins.org/survey_data/water/procedures_and_forms/Forms/MHW_Procedural_Approval_2016.pdf><b>MHW Procedural Approval Form if data IS available</b></a></p>');
            } else {
                // mhw and mlw are null
                $('#informationdiv').append('<p><a target="_blank" href=http://labins.org/survey_data/water/procedures_and_forms/Forms/MHW_Procedural_Approval_noelevation.pdf><b>MHW Procedural Approval Form if data IS NOT available</b></a></p>');

            }
        } else if (results[i-1].attributes.layerName === 'Tide Interpolation Points') {
            var replaceWhitespace = results[i-1].attributes.tile_name.replace(" ", "%20");
            $('#informationdiv').append('<p><b>Tide Interpolation Points</b></p>' +
                                    '<p><b>Tide Interpolation Points: </b>' + results[i-1].attributes.iden + '</p>' +
                                    '<p><b>County: </b>' + results[i-1].attributes.cname + '</p>' +
                                    '<p><b>Quad: </b>' + results[i-1].attributes.tile_name + '</p>' + 
                                    '<p><b>Method: </b>' + results[i-1].attributes.method + '</p>' +
                                    '<p><b>MHW (feet): </b>' + results[i-1].attributes.mhw2_ft + '</p>' +
                                    '<p><b>MLW (feet): </b>' + results[i-1].attributes.mlw2_ft + '</p>' +
                                    '<p><b>Station 1: </b>' + results[i-1].attributes.station1 + '</p>' +
                                    '<p><b>Station 2: </b>' + results[i-1].attributes.station2 + '</p>' 
                                    );
            if (results[i-1].attributes.status_col === "1") {
                // This is not a tidal point
            } else if (results[i-1].attributes.status_col === "2") {
                // The point has data, fill in the report as you are currently doing
                $('#informationdiv').append('<p><b>Download Approval Form: </b><a target="_blank" href=http://www.labins.org/survey_data/water/FlexMap_docs/interp_approval_form.cfm?pin=' + results[i-1].attributes.iden + '&mCountyName=' + results[i-1].attributes.cname + '&mQuad=' + replaceWhitespace + '&mhw=' + results[i-1].attributes.mhw2_ft + '&mlw=' + results[i-1].attributes.mlw2_ft + '>here</a></p>');
            } else if  (results[i-1].attributes.status_col === "3") {
                // This point needs a study
                $('#informationdiv').append('<p>This point needs a study. Click <a target="_blank" href=http://www.labins.org/survey_data/water/FlexMap_docs/MHW_Procedures_wo_29_or_88_data_May_2009_with_checklist.pdf>here</a> to open approval form.</p>');
            }
        } else if (results[i-1].attributes.layerName === 'R-Monuments') {
            $('#informationdiv').append('<p><b>Regional Coastal Monitoring Data</b> </p>' + 
                                    '<p><b>Feature ID: </b>' + results[i-1].attributes.unique_id + '</p>' +
                                    '<p><b>Monument Name: </b>' + results[i-1].attributes.monument_name + '</p>' + 
                                    '<p><b>State Plane Zone: </b>' + results[i-1].attributes.state_plane_zone + '</p>' +
                                    '<p><b>County: </b>' + results[i-1].attributes.county + '</p>' +
                                    '<p><b>Latitude: </b>' + results[i-1].attributes.latitude + '</p>' +
                                    '<p><b>Longitude: </b>' + results[i-1].attributes.longitude + '</p>' 
                                    );
        } else if (results[i-1].attributes.layerName === 'Erosion Control Line') {
            $('#informationdiv').append('<p><b>Erosion Control Line</b></p>' +
                                    '<p><b>County: </b>' + results[i-1].attributes.county + '</p>' + 
                                    '<p><b>ECL Name: </b>' + results[i-1].attributes.ecl_name + '</p>' +
                                    '<p><b>MHW: </b>' + results[i-1].attributes.mhw + '</p>' +
                                    '<p><b>Location: </b>' + results[i-1].attributes.location + '</p>' +
                                    '<p><b>Download Information: </b>' + '<a target="_blank" href=http://www.labins.org/survey_data/water/ecl_detail.cfm?sel_file=' + results[i-1].attributes.mhw + '.pdf&fileType=MAP>' + results[i-1].attributes.pdf1 + '</a></p>' 
                                    );
        } else if (results[i-1].attributes.layerName === 'Survey Benchmarks') {
            var replaceWhitespace = results[i-1].attributes.FILE_NAME.replace(" ", "%20");
            $('#informationdiv').append('<p><b>SWFWMD Survey Benchmarks</b></p>' + 
                                    '<p><b>Benchmark Name: </b>' + results[i-1].attributes.BENCHMARK_NAME + '</p>' +
                                    '<p>More Information: </b><a target="_blank" href=http://ftp.labins.org/swfwmd/SWFWMD_control_2013/' + replaceWhitespace + '>' + results[i-1].attributes.FILE_NAME + '</a></p>'
                                    );
            
        } else if (results[i-1].attributes.layerName === 'Township-Range-Section') {
            $('#informationdiv').append('<p><b>Section Lines</b> </p>' + 
                                    '<p><b>Section-Township-Range: </b>' + results[i-1].attributes.twnrngsec.substring(8,) + ' ' + results[i-1].attributes.twnrngsec.substring(1,4) + ' ' + results[i-1].attributes.twnrngsec.substring(5,8) + '</p>' +
                                    '<p><a target="_blank" href=http://www.labins.org/survey_data/landrecords/landrecords.cfm?town1=' + results[i-1].attributes.tr_dissolve.substring(0,2) + '&town2=' + results[i-1].attributes.tr_dissolve.substring(2,3) + '&range1='  + results[i-1].attributes.tr_dissolve.substring(3,5) + '&range2=' + results[i-1].attributes.tr_dissolve.substring(5,6) + '>' + 'Original GLO Survey Plats and Field Notes' + '</a></p>' +
                                    '<p><a target="_blank" href=http://199.73.242.221/Oculus/servlet/shell?command=hitlist&[catalog=6]&[entityType=any]&[searchBy=profile]&[profile=BSM+Office+Files]&[sortBy=Creator]&{STR+Coordinates=%20LK%20S0' + results[i-1].attributes.tr_dissolve.substring(0,2) + '%20' + results[i-1].attributes.twnrngsec.substring(0,4) + '%20' + results[i-1].attributes.twnrngsec.substring(4,8) + '}>' + 'Oculus Database - DEP Use Only' + '</a></p>'
                                    );
        } else if (results[i-1].attributes.layerName === 'Township-Range') {
            $('#informationdiv').append('<p><b>Township-Range Lines</b> </p>' + 
                                    '<p><b>Township-Range: </b>' + results[i-1].attributes.tr_dissolve.substring(0,3) + ' ' + results[i-1].attributes.tr_dissolve.substring(3,) + '</p>'
                                    );
        } else if (results[i-1].attributes.layerName === 'Geographic Names') {
            $('#informationdiv').append('<p><b>Geographic Names</b> </p>' + 
                                    '<p><b>Feature Name: </b>' + results[i-1].attributes.feature_na + '</p>' +
                                    '<p><b>Feature Class: </b>' + results[i-1].attributes.feature_cl + '</p>'
                                    );
        } else if (results[i-1].attributes.layerName === 'Certified Corners') {
            $('#informationdiv').append('<p><b>Certified Corners</b></p>' + 
                                    '<p><b>BLMID: </b>' + results[i-1].attributes.blmid + '</p>' +
                                    '<p><b>Quad Name: </b>' + results[i-1].attributes.tile_name + '</p>'
                                    );
            //console.log(results[i-1].attributes.image1);
            for (var prop in results[i-1].attributes) {
                if (prop.startsWith('image')) {
                    if (results[i-1].attributes[prop].length > 1) {
                        $('#informationdiv').append('<p><b>Image: </b><a target="_blank" href=' + results[i-1].attributes[prop] + '>' + results[i-1].attributes[prop].substring(40,52) + '</a></p>');
                    }
                }
                
            }
        }
        $('#informationdiv').append('<hr>')
        
    }
    currentIndex = i-1;
    console.log(i);
    //$('#numinput').val(parseInt(i));
    if (i == 1) {
    $('#arraylengthdiv').html((parseInt(i-1)) + ' feature found.');
    } else {
        $('#arraylengthdiv').html((parseInt(i-1)) + ' features found. ');
    }
}