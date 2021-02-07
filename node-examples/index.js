var rect = require("./rectangle");

function solveRectangle(l, b) {
    console.log("Solving for rectangle with l = " + l + " and b = " + b);
    rect(l, b, (err, rectangle) => {
        if (err) {
            console.log("Error:", err.message);
        }
        else {
            console.log("Area: " + rectangle.area());
            console.log("Peremiter:" + rectangle.perimeter());
        }
    });
    console.log("After Callback!")
}

solveRectangle(2, 4);
solveRectangle(3, 5);
solveRectangle(0, 5);
solveRectangle(-3, 5);