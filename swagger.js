import { setSwagger, UIData } from './swaggerfunction.js';

window.ui = UIData;
window.onload = function () {
    setSwagger();
};

// Base API URL (Change if needed)
const BASE_URL = "https://farmsdistribution-2664aad5e284.herokuapp.com";

// 🔑 Tokens for different endpoint groups
const GENERAL_AUTH_TOKEN = "v4.public.eyJhbGlhcyI6IkFobWFkIFJpZmtpIEF5YWxhIiwiZXhwIjoiMjAyNS0wMi0wMlQyMjoyODowOFoiLCJpYXQiOiIyMDI1LTAyLTAyVDA0OjI4OjA4WiIsImlkIjoiMDg1MTgzMTMwNTE2IiwibmJmIjoiMjAyNS0wMi0wMlQwNDoyODowOFoiffJ7umkzZm7mYw-hBt0ii2UCKwnP6KruZhmol-VnhD-2H4VOZbuDAYxVAfVifTdIdtl1_sjxbTNQg1Bx5NhjcQE"; // Replace with the first token
const SPECIAL_AUTH_TOKEN = "v4.public.eyJhbGlhcyI6IkhhamkgU2FkaWtpbiBBenphbSIsImV4cCI6IjIwMjUtMDItMDNUMDE6MjQ6MTRaIiwiaWF0IjoiMjAyNS0wMi0wMlQwNzoyNDoxNFoiLCJpZCI6IjA4MjE4NDk1MjU4MyIsIm5iZiI6IjIwMjUtMDItMDJUMDc6MjQ6MTRaIn3KQqOxhzTuLiI9NigK-b-S_WXEbhW0zMXYFV1blfJm1m1NFhI8LMmR8iq-ivIRLdvT0BGQURkbU4DJPf52b4sF"; // Replace with the second token


// 🔍 Endpoint Groups
const generalEndpoints = [
    "/role-menu",
    "/role",
    "/role-id?id=100",
    "/address",
    "/profile",
    "/profile/by-id?id=151",
    "/profile/all",
    "/all/peternak",
    "/status/peternak",
    "/toko?lat=-6.873401331252015&lon=107.57627981679529&radius=5",
    "/all/akun",
    "/get/akun/?id=151"
];

const specialEndpoints = [
    "/all/order",
    "/product/mine",
    "/product/get/?id=24"
];

// 🌟 Function to create and add a Start Button
function createStartButton() {
    let button = document.createElement("button");
    button.textContent = "Start API Testing";
    button.style.padding = "10px";
    button.style.margin = "20px";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";
    button.style.backgroundColor = "#28a745";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";

    button.onclick = function () {
        stressTestEndpoints(generalEndpoints, GENERAL_AUTH_TOKEN);
        stressTestEndpoints(specialEndpoints, SPECIAL_AUTH_TOKEN);
    };

    document.body.appendChild(button);
}

// 🚀 Function to perform the API stress test
async function stressTestEndpoints(endpoints, token) {
    let resultsContainer = document.createElement("div");
    resultsContainer.innerHTML = "<h2>API Stress Test Results</h2>";
    document.body.appendChild(resultsContainer);

    for (let endpoint of endpoints) {
        let url = `${BASE_URL}${endpoint}`;
        let successCount = 0;
        let failureCount = 0;
        let failures = [];
        let totalAttempts = 50;

        let endpointResult = document.createElement("div");
        endpointResult.style.border = "1px solid black";
        endpointResult.style.padding = "10px";
        endpointResult.style.marginBottom = "10px";
        endpointResult.style.backgroundColor = "#f4f4f4";
        endpointResult.innerHTML = `<h3>Endpoint: ${endpoint}</h3><p><strong>Waiting for test...</strong></p>`;
        resultsContainer.appendChild(endpointResult);

        for (let i = 0; i < totalAttempts; i++) {
            try {
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        "login": token, // 🔥 Using the appropriate token
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok && response.status !== 204) {
                    successCount += 1;
                } else {
                    // Specific detection for 204 No Content or OPTIONS requests
                    if (response.status === 204 || response.type === "opaque") {
                        failureCount += 1;
                        failures.push(`Attempt ${i + 1}: Status 204 (No Content or OPTIONS request)`);
                    } else {
                        failureCount += 1;
                        failures.push(`Attempt ${i + 1}: Status ${response.status}`);
                    }
                }
            } catch (error) {
                failureCount += 1;
                failures.push(`Attempt ${i + 1}: Request failed`);
            }

            // **Update UI dynamically**
            requestAnimationFrame(() => {
                let failureRate = ((failureCount / totalAttempts) * 100).toFixed(2); // Calculate failure percentage

                endpointResult.innerHTML = `<h3>Endpoint: ${endpoint}</h3>`;
                endpointResult.innerHTML += `<p><strong>Success:</strong> ${successCount}</p>`;
                endpointResult.innerHTML += `<p><strong>Failed:</strong> ${failureCount}</p>`;
                endpointResult.innerHTML += `<p><strong>Failure Rate:</strong> ${failureRate}%</p>`;

                if (failures.length > 0) {
                    let failureList = document.createElement("ul");
                    failures.forEach(failure => {
                        let listItem = document.createElement("li");
                        listItem.textContent = failure;
                        failureList.appendChild(listItem);
                    });
                    endpointResult.appendChild(failureList);
                }
            });
        }
    }
}

// 🖱 Add Start Button on Page Load
window.onload = function () {
    setSwagger();
    setTimeout(() => {
        createStartButton();
    }, 500);
};
