// const _ = require("underscore");
// const request = require("request");
// const utils = require("./utils");

// module.exports = {
//   computeCoordinates: function (inputs) {
//     const api_key = process.env.GMAP_API_KEY;
//     return new Promise((resolve, reject) => {
//       var the_address = [];
//       the_address.push(inputs.street || inputs.route);
//       the_address.push(inputs.box || inputs.street_number);
//       the_address.push(inputs.city || inputs.locality);
//       the_address.push(inputs.zipcode || inputs.postal_code);
//       the_address.push(inputs.country || "Belgique");
//       the_address = the_address.join(" ");
//       the_address = utils.utf8Encode(the_address);

//       var url =
//         "https://maps.googleapis.com/maps/api/geocode/json?address=" +
//         the_address +
//         "&key=" +
//         api_key;

//       var options = {
//         uri: url,
//         method: "GET",
//       };

//       request(options, (error, response, body) => {
//         var body = JSON.parse(body);
//         if (!error && response.statusCode == 200) {
//           var results = body.results;
//           // console.log(results, results.length)
//           if (results.length === 1) {
//             var result = results[0];
//             var components = result.address_components;
//             // console.log(components)
//             var components_by_name = {};
//             _.each(components, (component) => {
//               var name = component.types[0];
//               components_by_name[name] = component.long_name;
//             });
//             // console.log(components_by_name)
//             inputs.route = components_by_name["route"];
//             inputs.postal_code = components_by_name["postal_code"];
//             inputs.country = components_by_name["country"];
//             inputs.street_number = components_by_name["street_number"];
//             inputs.locality = components_by_name["locality"];
//             inputs.administrative_area_1 =
//               components_by_name["administrative_area_level_1"];
//             inputs.administrative_area_2 =
//               components_by_name["administrative_area_level_2"];
//             inputs.address = result.formatted_address;
//             inputs.lat = result.geometry.location.lat;
//             inputs.lng = result.geometry.location.lng;
//             // console.log(result.geometry)
//             resolve(inputs);
//           } else if (results.length > 1) {
//             reject(
//               "Soyez plus précis ! Google trouve plusieurs résultats pour cette adresse"
//             );
//           } else {
//             reject(
//               "Cette adresse semble invalide. Google n'a trouvé aucune coordonnée géographique pour " +
//                 the_address
//             );
//           }
//         } else if (error) {
//           reject(error);
//         } else {
//           reject(
//             response.statusCode +
//               " : " +
//               body.error_message +
//               ". Veuillez réessayer plus tard ! L'adresse encodée est <<" +
//               the_address +
//               ">>"
//           );
//         }
//       });
//     });
//   },
// };
