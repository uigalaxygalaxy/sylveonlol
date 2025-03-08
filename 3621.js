
const wrappers = document.querySelectorAll('.bestSellingItemWrapper');

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


hoverButton.addEventListener('mouseover', async () => {
    const items = await fetchBestSelling('keycaps');
    updateWrapperContent(wrappers, items);
});

bundleButton.addEventListener('mouseover', async () => {
    const items = await fetchBestSelling('bundles');
    updateWrapperContent(wrappers, items);
});

keyboardButton.addEventListener('mouseover', async () => {
    const items = await fetchBestSelling('keyboards');
    updateWrapperContent(wrappers, items);
});

deskmatsButton.addEventListener('mouseover', async () => {
    if (DeskmatEnabled) {
        const items = await fetchBestSelling('deskmats');
        updateWrapperContent(wrappers, items);
    }
});

AccessoriesBttn.addEventListener('mouseover', async () => {
    const items = await fetchBestSelling('accessories');
    updateWrapperContent(wrappers, items);
});

DealsBttn.addEventListener('mouseover', async () => {
    if (DealsEnabled) {
        const items = await fetchDeals();
        updateWrapperContent(wrappers, items);
    }
});