let database = [];

const galleryView = document.getElementById('galleryView');
const detailView = document.getElementById('detailView');
const regionGrid = document.getElementById('regionGrid');
const searchInput = document.getElementById('searchInput');
const backBtn = document.getElementById('backBtn');
const categoryFilter = document.getElementById('categoryFilter');

async function init() {
    try {
        const response = await fetch('website_data.json');
        const data = await response.json();
        database = data.regions;
        
        // Extract unique categories and populate dropdown
        const allCats = new Set();
        database.forEach(item => {
            if (item.categories && item.categories.length > 0) {
                item.categories.forEach(c => allCats.add(c));
            } else {
                allCats.add('Uncategorized');
            }
        });
        
        const categories = [...allCats].sort();
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
        
        renderGallery(database);
    } catch (e) {
        regionGrid.innerHTML = '<div class="loading">Failed to load database. Ensure you are running on a local server.</div>';
        console.error(e);
    }
}

function renderGallery(items) {
    regionGrid.innerHTML = '';
    if (items.length === 0) {
        regionGrid.innerHTML = '<div class="loading">No results found.</div>';
        return;
    }
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => showDetail(item);
        
        // Prefer diagram for the thumbnail, fallback to cadaver
        const thumbSrc = item.diagram || item.cadaver || '';
        
        card.innerHTML = `
            <img src="${thumbSrc}" loading="lazy">
            <div class="card-content">
                <div class="card-id">ID: ${item.id}</div>
                <div class="card-title">${item.title || 'Untitled Anatomy'}</div>
            </div>
        `;
        regionGrid.appendChild(card);
    });
}

function showDetail(item) {
    galleryView.classList.add('hidden');
    detailView.classList.remove('hidden');
    
    document.getElementById('detailTitle').textContent = item.title;
    document.getElementById('detailDescription').textContent = item.description || 'No description available.';
    
    document.getElementById('cadaverImg').src = item.cadaver || '';
    document.getElementById('diagramImg').src = item.diagram || '';
    
    const legendList = document.getElementById('legendList');
    legendList.innerHTML = '';
    if (item.labels && item.labels.length > 0) {
        item.labels.forEach(label => {
            const li = document.createElement('li');
            li.textContent = label;
            legendList.appendChild(li);
        });
    } else {
        legendList.innerHTML = '<li>No labeled parts available for this view.</li>';
    }
}

backBtn.onclick = () => {
    detailView.classList.add('hidden');
    galleryView.classList.remove('hidden');
};

function applyFilters() {
    const query = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    const filtered = database.filter(item => {
        const matchesSearch = item.id.toLowerCase().includes(query) || 
                              item.title.toLowerCase().includes(query) ||
                              (item.description && item.description.toLowerCase().includes(query));
        
        const itemCats = item.categories && item.categories.length > 0 ? item.categories : ['Uncategorized'];
        const matchesCategory = selectedCategory === 'all' || itemCats.includes(selectedCategory);
        
        return matchesSearch && matchesCategory;
    });
    renderGallery(filtered);
}

searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);

// Load on start
init();
