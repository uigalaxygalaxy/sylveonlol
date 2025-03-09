
const wrappers = document.querySelectorAll('.bestSellingItemWrapper');

// Cache object to store fetched data
const cachedData = {
    keycaps: [],
    bundles: [],
    keyboards: [],
    deskmats: [],
    accessories: [],
    deals: []
};

// Fetch all data on page load
async function fetchAllData() {
    try {
        cachedData.keycaps = await fetchBestSelling('keycaps');
        cachedData.bundles = await fetchBestSelling('bundles');
        cachedData.keyboards = await fetchBestSelling('keyboards');
        cachedData.deskmats = await fetchBestSelling('deskmats');
        cachedData.accessories = await fetchBestSelling('accessories');
        cachedData.deals = await fetchDeals();
        console.log('All data fetched and cached successfully!');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call fetchAllData when the page loads
window.addEventListener('load', fetchAllData);

function createItemHTML(item) {
    return `
        <img class="bestsellingimg" src="${item.imgSrc}">
        <div class="bestTitle">${item.title}
            <div>
                <p class="price" style="font-size: 26px">${item.price}<span style="font-size: 12px; white-space: pre;"> </span><p class="priceStrike"><span style="text-decoration: line-through rgba(128,128,128,0.5); font-size: 16px; white-space: pre">${item.discount}</span> <p> <span class="discountText" style="font-size: 18px;">${item.percent}</span> </p>
            </div>
        </div>
    `;
}

function updateWrapperContent(wrappers, items) {
    wrappers.forEach((wrapper, index) => {
        const item = items[index] || { imgSrc: "", title: "", price: "", discount: "", percent: "" }; // Fallback for missing items
        wrapper.innerHTML = createItemHTML(item);
    });
}

async function fetchBestSelling(category) {
    try {
        const response = await fetch(`/api/best-selling?category=${category}`);
        if (!response.ok) {
            throw new Error('Failed to fetch best-selling items');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}
async function fetchDeals() {
    try {
        const response = await fetch(`/api/deals`);
        if (!response.ok) {
            throw new Error('Failed to fetch best-selling items');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Event listeners for category buttons
const hoverButton = document.getElementById('keycapsBttn');
const bundleButton = document.getElementById('bundleBttn');
const keyboardButton = document.getElementById('keyboardBttn');
const deskmatsButton = document.getElementById('deskmatsBttn');
const AccessoriesBttn = document.getElementById('accessoriesBttn');
const DealsBttn = document.getElementById('dealsBttn');

hoverButton.addEventListener('mouseenter', () => {
    DeskmatEnabled = false;
});

AccessoriesBttn.addEventListener('mouseenter', () => {
    DealsEnabled = false;
});

const MetroWrapper = document.querySelector('.categoryMetroWrapper');

MetroWrapper.addEventListener('mouseleave', () => {
DeskmatEnabled = true;
DealsEnabled = true;
});


hoverButton.addEventListener('mouseover', () => {
    updateWrapperContent(wrappers, cachedData.keycaps);
});

bundleButton.addEventListener('mouseover', () => {
    updateWrapperContent(wrappers, cachedData.bundles);
});

keyboardButton.addEventListener('mouseover', () => {
    updateWrapperContent(wrappers, cachedData.keyboards);
});

deskmatsButton.addEventListener('mouseover', () => {
    if (DeskmatEnabled) {
        updateWrapperContent(wrappers, cachedData.deskmats);
    }
});

AccessoriesBttn.addEventListener('mouseover', () => {
    updateWrapperContent(wrappers, cachedData.accessories);
});

DealsBttn.addEventListener('mouseover', () => {
    if (DealsEnabled) {
        updateWrapperContent(wrappers, cachedData.deals);
    }
});