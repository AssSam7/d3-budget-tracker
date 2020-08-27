<h1 align="center">Budget Tracker 🍩</h1>
<p align="center">
  <img src="https://img.shields.io/badge/materialize-v1.0-ff69b4">
  <img src="https://img.shields.io/badge/D3.js-v5-important">
  <img src="https://img.shields.io/badge/firebase-v7.19.0-yellow">
</p>

<p align="center">
  <img src="https://i.ibb.co/GcCcGKr/Capture.png" alt="Capture">
</p>

## Demo 🪁
https://pedantic-archimedes-31ed80.netlify.app

## Getting Started 🚀

### 1. D3.js CDN

Add the following **CDN** at the end of the <body> in **index.html**

```html
<script src="https://d3js.org/d3.v5.js"></script>
```

### 2. Firebase CDN

Get the below code from console.firebase.google.com and check out, Adding this project to the web app

```html
<script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.19.0/firebase-firestore.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDQQN1E2V8K8wFqjHKiSjimAHvjagZst0k",
    authDomain: "d3-firebase-starter.firebaseapp.com",
    databaseURL: "https://d3-firebase-starter.firebaseio.com",
    projectId: "d3-firebase-starter",
    storageBucket: "d3-firebase-starter.appspot.com",
    messagingSenderId: "1020387918909",
    appId: "1:1020387918909:web:508221bf07b68bc2079654",
    measurementId: "G-XJ376VQ9BE",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
</script>
```
## HTML template using Materialize-css

### 1. Header
```html
<header class="darken-1 section">
   <h2 class="center white-text">Malsaslam</h2>
   <p class="flow-text grey-text center text-lighten-2">
     Monthly money tracker
   </p>
</header>
```

### 2. Main Content Grid
```html
<div class="container section">
  <div class="row">
    ...
    ...
    ...
  </div>
</div>
```

#### 2.1 Form
```html
<form class="card z-depth-0">
  <div class="card-content">
    <span class="card-title indigo-text">Add Item:</span>
    <div class="input-field">
      <input type="text" id="name" />
      <label for="name">Item Name</label>
    </div>
    <div class="input-field">
      <input type="text" id="cost" />
      <label for="cost">Item Cost ($) </label>
    </div>
    <div class="input-field center">
      <button class="btn-large pink white-text">Add item</button>
    </div>
    <div class="input-field center">
      <p class="red-text" id="error"></p>
    </div>
  </div>
</form>
```

#### 2.2 Graph Canvas
```html
<div class="col s12 m5 push-m1">
  <div class="canvas"></div>
</div>
```

