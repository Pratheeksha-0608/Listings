    mapboxgl.accessToken=mapToken;
    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    }); // create a marker at a coordinate
const marker = new mapboxgl.Marker({color:"red"})
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${maplocation}</h4>`)
    .setMaxWidth("100px"))
  .addTo(map);