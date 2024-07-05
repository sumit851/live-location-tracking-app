const socket = io();
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error.message);
      // Handle the error according to your application's needs
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
  // Handle the lack of geolocation support
}

// L.map("map").setView([0, 0], 1);

// var map = L.map("map").setView([51.505, -0.09], 13);
// // Other map initialization code...
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "© OpenStreetMap contributors",
// });
// var marker = L.marker([51.5, -0.09]);
// marker.addTo(map); // This is where you mights be encountering the error

// L.tileLayer("https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "Bhuvan",
// }).addTo(map);
// console.log(map);

var map = L.map("map").setView([51.505, -0.09], 16);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const markers = {};

socket.on("recieve-location", (msg) => {
  const { id, latitude, longitude } = msg;
  map.setView([latitude, longitude]);
  markers[id]
    ? markers[id].setLatLang([latitude, longitude])
    : (markers[id] = L.marker([latitude, longitude]).addTo(map));
});

socket.on("disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
