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

Add the following **CDN** at the end of the **body** tag in the **index.html**

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

## HTML template using Materialize-CSS

### 1. Header

```html
<header class="darken-1 section">
  <h2 class="center white-text">Malsaslam</h2>
  <p class="flow-text grey-text center text-lighten-2">Monthly money tracker</p>
</header>
```

### 2. Main Content Grid

```html
<div class="container section">
  <div class="row">... ... ...</div>
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

## Selecting DOM Elements

```javascript
const form = document.querySelector("form");
const name = document.querySelector("#name");
const cost = document.querySelector("#cost");
const error = document.querySelector("#error");
```

## Form Event Listener

```javascript
form.addEventListener("submit", (e) => {
  e.preventDefault();
  ...
  ...
});
```

### 1. Form Validations

```javascript
if (name.value && cost.value) {
  error.textContent = "";
} else {
  error.textContent = "Please enter the above values";
}
```

### 2. Saving the data from the form to firestore

```javascript
const item = {
  name: name.value,
  cost: parseInt(cost.value),
};

// Inserting a new document in the firestore database
db.collection("budget-planner")
  .add(item)
  .then((res) => {
    name.value = "";
    cost.value = "";
  });
```

## Adding visualizations 🎨

### 1. Setting the dimensions

Using the Javascript object to store the dimensions

```javascript
const dims = {
  height: 300,
  width: 300,
  radius: 150,
};

const cent = {
  x: dims.width / 2 + 5,
  y: dims.height / 2 + 5,
};
```

### 2. Selecting the canvas and appending SVG

```javascript
const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", dims.width + 150)
  .attr("height", dims.height + 150);

const graph = svg
  .append("g")
  .attr("transform", `translate(${cent.x}, ${cent.y})`);
```

### 3. Pie Generator

It is used to generate the angles of pie slices automatically based on data. On passing the data through this, it results a bunch of angles binded with data which are essential to draw the arcs and form the donut chart

```javascript
const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.cost);
```

To unsort the data, **.sort()** must be called with **null** as a parameter.

### 4. Arc Path Generator

From the **Pie-generator** angles to draw the arcs are generated, from the **Arc path** generator the donut chart can be drawn using those angles.

```javascript
const arcPath = d3.arc().outerRadius(dims.radius).innerRadius(70);
```

- **Outer radius:** The radius of the outer slice, also known as overall radius.
- **Inner radius:** The radius from the center of the circle where the arc should be drawn.

### 5. Ordinal Scale

This scale is used to generate the colors with which the arcs or slices of the donut chart are drawn. It accepts **names** properties in our case as the **domain** and return a range of **colors** to be filled. In this project, I used a **scheme set** to automically determine the color based of domain values.

```javascript
const color = d3.scaleOrdinal(d3["schemeSet2"]);
```

### 6. Listening for real-time data updates from firestore

We can use **onSnapshot()** method of the firestore. This method accepts a call-back as an argument with **res** as its parameter.

1. Apply this method on our collection where the data is stored
2. There are 3 cases of data alteration in firestore
   - **Added**: When a new document is added to the collection.
   - **Modified**: When a existing document properties are altered or new properties are added to an existing document.
   - **Deleted**: When an existing document is deleted.

```javascript
db.collection("budget-planner").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    const doc = { ...change.doc.data(), id: change.doc.id };

    switch (change.type) {
      case "added":
        data.push(doc);
        break;
      case "modified":
        const index = data.findIndex((item) => item.id == doc.id);
        data[index] = doc;
        break;
      case "removed":
        data = data.filter((item) => item.id !== doc.id);
        break;
      default:
        break;
    }
  });

  update(data);
});
```

### 7. Update function

The function that executes everytime the data changes to re-renders the visualizations.

1. Passing names to ordinal scale domain

```javascript
color.domain(data.map((d) => d.name));
```

2. Join enhanced (pie) data to path elements

```javascript
const paths = graph.selectAll("path").data(pie(data));
```

3. Exit selection

```javascript
paths.exit().remove();
```

4. Current DOM updates

```javascript
paths.attr("d", arcPath);
```

5. Adding elements from exit selection

```javascript
paths
  .enter()
  .append("path")
  .each(function (d) {
    this._current = d;
  })
  .attr("class", "arc")
  .attr("stroke", "#fff")
  .attr("stroke-width", 3)
  .attr("fill", (d) => color(d.data.name));
```

6. Update and call legends

```javascript
legendGroup.call(legend);
legendGroup.selectAll("text").attr("fill", "white");
```

## Transitions using Custom Tweens

Tweens are similar to **key frames** in CSS, where we can create complex transitions based on usecase. It operates based on 2 values

- **Interpolation function:** It is like the starting and ending states of animation.
- **Time-ticker:** It ticks between **0** and **1** for all the range of values interpolated.

### 1. Arc Enter Tween

This tween renders the animation when the arc enters the selection.

```javascript
const arcTweenEnter = (d) => {
  let i = d3.interpolate(d.endAngle, d.startAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};
```

**Applying**

```javascript
.transition()
.duration(750)
  .attrTween("d", arcTweenEnter);
```

### 2. Arc Exit Tween

The transition when an element is deleted and removed through the exit selection.

```javascript
const arcTweenExit = (d) => {
  let i = d3.interpolate(d.startAngle, d.endAngle);

  return function (t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};
```

**Applying**

```javascript
.transition().duration(750).attrTween("d", arcTweenExit)
```

### 3. Arc Update Tween

When a value is updated in the back-end, this animation is applied to re-render the visualization.

```javascript
function arcTweenUpdate(d) {
  // Interpolate between the two objects
  let i = d3.interpolate(this._current, d);

  // Update the current to the new values
  this._current = i(1);

  return function (t) {
    return arcPath(i(t));
  };
}
```

**Applying**

```javascript
.transition()
    .duration(750)
    .attrTween("d", arcTweenUpdate);
```

## Legends

Legends are those small dots beside the chart which describe the mapping of color with the propery i.e. name in this case. For drawing legends, I used a third-party plug-in of **D3.js** for visualizing legends.

### 1. Legend Group

```javascript
const legendGroup = svg
  .append("g")
  .attr("transform", `translate(${dims.width + 40}, 10)`);
```

### 2. Drawing legend

```javascript
const legend = d3.legendColor().shape("circle").scale(color).shapePadding(15);
```

### 3. Updating and calling legends

```javascript
legendGroup.call(legend);
legendGroup.selectAll("text").attr("fill", "white");
```

## Interactive Visualizations

### 1. Mouse Events

We can change the visualizations on interaction, like in our case change the color of the slice on mouse hover

**Adding mouseover event**

```javascript
graph.selectAll("path").on("mouseover", handleMouseOver);
```

**Mouseover event handler**

```javascript
const handleMouseOver = (d, i, n) => {
  d3.select(n[i]).transition().duration(300).attr("fill", "#fff");
};
```

**Adding mouseout event (To revert the color on mouse exit)**

```javascript
.on("mouseout", handleMouseOut)
```

**Mouseout event handler**

```javascript
const handleMouseOut = (d, i, n) => {
  d3.select(n[i]).transition().duration(300).attr("fill", color(d.data.name));
};
```

**Naming the transition to prevent one transition interfere another**

```javascript
.transition("changeSliceColor")
.transition("revertSliceColor")
```

### 2. Click Events

Delete that particular slice on clicking it

**Adding the click event**

```javascript
.on("click", handleClick)
```

**Handler of the click event**

To delete a particular element from the firestore, we use the **.delete()** by selecting the document using the **id**

```javascript
const handleClick = (d, i, n) => {
  const id = d.data.id;
  db.collection("budget-planner").doc(id).delete();
};
```

## Adding the Tool-tips

Tooltips are like the dummy text displayed when an event is triggered on an element. In this project, I used a third party plug-in for D3 called **d3-tip** to draw the tooltip.

### 1. Adding the CDN

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.js"
  integrity="sha512-jaNmuLbHtQ1ND+i63wVvwBd9T2hB3gTnk3x0Pp5R+AJwDdyzMe3t0vQqwUSoI9a/Ol1nscGV/1et4zSwL0P3AA=="
  crossorigin="anonymous"
></script>
```

### 2. Creating the tip and Applying it

```javascript
const tip = d3.tip().attr("class", "tip card");

graph.call(tip);
```

### 3. Rendering the data on the tooltip

I have used the ES6 template strings for this purpose

```javascript
.html((d) => {
  let content = `
    <div class="name">${d.data.name}</div>
  `;
  content += `<div class="cost">${d.data.cost}</div>`;
  content += `<div class="delete">Click slice to delete</div>`;

  return content;
});
```

### 4. Styling the tooltip

```css
.tip {
  padding: 10px;
  background: #333;
  color: #fff;
}

.tip .delete {
  color: hotpink;
  font-size: 0.8em;
}
```

### 5. Applying the visualizations (tooltips) based on interactions (events)

**Mouse hover (Show the tooltip)**

```javascript
.on("mouseover", (d, i, n) => {
  tip.show(d, n[i]);
  handleMouseOver(d, i, n);
})
```

**Mouse out (Hide the tooltip)**

```javascript
.on("mouseout", (d, i, n) => {
  tip.hide();
  handleMouseOut(d, i, n);
})
```
