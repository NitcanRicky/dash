// Dummy Dataset for RetailIQ Dashboard
window.DATA = {
    // User data
    users: [],
    
    // Sales data
    sales: [],
    
    // Product data
    products: [],
    
    // City data
    cities: {
        A: { name: "Category A Cities", description: "Major metropolitan areas" },
        B: { name: "Category B Cities", description: "Mid-sized urban centers" },
        C: { name: "Category C Cities", description: "Smaller towns and rural areas" }
    }
};

// Generate user data
function generateUsers(count = 50) {
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 
                       'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah', 'Thomas', 'Karen', 'Charles', 'Nancy',
                       'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Sophia', 'Jackson', 'Isabella', 'Lucas', 'Mia'];
    
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
                      'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
                      'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright'];
    
    const occupations = ['Doctor', 'Teacher', 'Engineer', 'Salesperson', 'Developer', 'Designer', 'Accountant', 'Nurse', 'Manager', 'Student'];
    const genders = ['Male', 'Female'];
    const maritalStatuses = ['Single', 'Married', 'Divorced'];
    
    // Define actual cities and states
    const locations = [
        { city: 'New York', state: 'New York' },
        { city: 'Los Angeles', state: 'California' },
        { city: 'Chicago', state: 'Illinois' },
        { city: 'Houston', state: 'Texas' },
        { city: 'Phoenix', state: 'Arizona' },
        { city: 'Philadelphia', state: 'Pennsylvania' },
        { city: 'San Antonio', state: 'Texas' },
        { city: 'San Diego', state: 'California' },
        { city: 'Dallas', state: 'Texas' },
        { city: 'San Jose', state: 'California' },
        { city: 'Austin', state: 'Texas' },
        { city: 'Jacksonville', state: 'Florida' },
        { city: 'Fort Worth', state: 'Texas' },
        { city: 'Columbus', state: 'Ohio' },
        { city: 'Charlotte', state: 'North Carolina' },
        { city: 'San Francisco', state: 'California' },
        { city: 'Indianapolis', state: 'Indiana' },
        { city: 'Seattle', state: 'Washington' },
        { city: 'Denver', state: 'Colorado' },
        { city: 'Boston', state: 'Massachusetts' }
    ];
    
    const users = [];
    
    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        // Ensure some users are under 18 for the 0-17 age group
        let age;
        if (i < count * 0.05) { // Make 5% of users under 18
            age = Math.floor(Math.random() * 17) + 1; // Age 1-17
        } else {
            age = Math.floor(Math.random() * 60) + 18; // Age 18-77
        }
        
        const user = {
            id: i + 1,
            name: `${firstName} ${lastName}`,
            age: age,
            gender: genders[Math.floor(Math.random() * genders.length)],
            occupation: occupations[Math.floor(Math.random() * occupations.length)],
            maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
            location: {
                city: location.city,
                state: location.state,
                country: 'USA'
            },
            registrationDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            lastLoginDate: new Date(2023, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1)
        };
        users.push(user);
    }
    
    return users;
}

// Generate products
function generateProducts(count = 50) {
    // Define product categories with realistic names
    const categories = [
        { id: 1, name: "Electronics", products: [
            "Smartphone Pro", "Wireless Earbuds", "Ultra HD Smart TV", "Laptop Elite", "Digital Camera",
            "Bluetooth Speaker", "Fitness Tracker", "Gaming Console", "Wireless Charger", "Smart Watch"
        ]},
        { id: 2, name: "Clothing", products: [
            "Classic T-Shirt", "Slim Fit Jeans", "Casual Hoodie", "Athletic Shorts", "Formal Dress Shirt",
            "Winter Jacket", "Running Shoes", "Designer Sunglasses", "Leather Belt", "Cotton Socks"
        ]},
        { id: 3, name: "Home & Kitchen", products: [
            "Coffee Maker", "Air Fryer", "Non-Stick Pan Set", "Smart Refrigerator", "Blender Pro",
            "Robot Vacuum", "Microwave Oven", "Toaster", "Knife Set", "Cookware Collection"
        ]},
        { id: 4, name: "Beauty & Personal Care", products: [
            "Facial Cleanser", "Moisturizing Cream", "Hair Dryer", "Electric Shaver", "Perfume Collection",
            "Makeup Kit", "Whitening Toothpaste", "Men's Grooming Kit", "Nail Polish Set", "Hair Styling Tools"
        ]},
        { id: 5, name: "Books & Media", products: [
            "Bestselling Novel", "Children's Picture Book", "Cookbook Collection", "History Encyclopedia", "Self-Help Guide",
            "Business Strategy Book", "Sci-Fi Trilogy", "Travel Guide", "Educational Textbook", "Audiobook Subscription"
        ]},
        { id: 6, name: "Sports & Outdoors", products: [
            "Tennis Racket", "Yoga Mat", "Camping Tent", "Hiking Backpack", "Basketball",
            "Fishing Rod", "Mountain Bike", "Golf Club Set", "Fitness Dumbbell", "Swimming Goggles"
        ]},
        { id: 7, name: "Toys & Games", products: [
            "Building Blocks", "Remote Control Car", "Board Game Collection", "Action Figure", "Plush Animal",
            "Educational Puzzle", "Video Game", "Dollhouse", "Card Game Set", "Science Kit"
        ]},
        { id: 8, name: "Groceries", products: [
            "Organic Coffee", "Gourmet Chocolate", "Artisan Pasta", "Specialty Tea", "Premium Olive Oil",
            "Aged Cheese", "Gluten-Free Bread", "Dried Fruit Mix", "Granola Bars", "Spice Collection"
        ]},
        { id: 9, name: "Furniture", products: [
            "Ergonomic Office Chair", "Sofa Set", "Queen Size Bed", "Dining Table", "Bookshelf",
            "Coffee Table", "TV Stand", "Nightstand", "Outdoor Patio Set", "Storage Cabinet"
        ]},
        { id: 10, name: "Automotive", products: [
            "Car GPS Navigator", "Dash Camera", "Floor Mats", "Car Seat Covers", "Air Freshener",
            "Portable Tire Inflator", "Bluetooth Car Adapter", "Car Cleaning Kit", "Phone Mount", "Jump Starter"
        ]}
    ];
    
    // Define realistic brand names by category
    const brandsByCategory = {
        1: ["Apple", "Samsung", "Sony", "LG", "Bose", "JBL", "Fitbit", "Microsoft", "Google", "Lenovo"],
        2: ["Nike", "Adidas", "Levi's", "H&M", "Zara", "Gap", "Under Armour", "Ralph Lauren", "Gucci", "Calvin Klein"],
        3: ["KitchenAid", "Cuisinart", "Breville", "Ninja", "Instant Pot", "Calphalon", "iRobot", "Keurig", "Dyson", "Vitamix"],
        4: ["L'Oreal", "Neutrogena", "Olay", "Dove", "Maybelline", "Revlon", "Gillette", "Clinique", "Pantene", "Estée Lauder"],
        5: ["Penguin Random House", "HarperCollins", "Simon & Schuster", "Hachette", "Macmillan", "Scholastic", "Wiley", "Pearson", "Audible", "Kindle"],
        6: ["Wilson", "Coleman", "The North Face", "Columbia", "Spalding", "Callaway", "Shimano", "Schwinn", "Bowflex", "Speedo"],
        7: ["LEGO", "Mattel", "Hasbro", "Fisher-Price", "Nintendo", "Electronic Arts", "PlayStation", "Melissa & Doug", "Ravensburger", "Nerf"],
        8: ["Whole Foods", "Ghirardelli", "Barilla", "Twinings", "Bertolli", "Kraft", "Udi's", "Sun-Maid", "Nature Valley", "McCormick"],
        9: ["IKEA", "Ashley Furniture", "La-Z-Boy", "Pottery Barn", "Crate & Barrel", "West Elm", "Wayfair", "Serta", "Herman Miller", "Restoration Hardware"],
        10: ["Garmin", "Thinkware", "WeatherTech", "Covercraft", "Febreze", "Slime", "Anker", "Meguiar's", "iOttie", "NOCO"]
    };
    
    // Generate products with realistic names
    const products = [];
    let productId = 1;
    
    // Keep track of products generated to avoid duplicates
    const productsGenerated = {};
    
    while (products.length < count) {
        // Select a random category
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // Select a random product from that category
        const productName = category.products[Math.floor(Math.random() * category.products.length)];
        
        // Get a random brand for this category
        const brands = brandsByCategory[category.id];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        
        // Create a unique key for this product
        const productKey = `${category.id}-${productName}-${brand}`;
        
        // If we haven't added this product yet, add it
        if (!productsGenerated[productKey]) {
            const product = {
                id: productId++,
                name: productName,
                category: {
                    id: category.id,
                    name: category.name
                },
                price: parseFloat((Math.random() * 990 + 10).toFixed(2)),
                stock: Math.floor(Math.random() * 500) + 1,
                rating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
                releaseDate: randomDate(new Date(2020, 0, 1), new Date()),
                brand: brand
            };
            
            products.push(product);
            productsGenerated[productKey] = true;
        }
    }
    
    return products;
}

// Generate sales data with time distribution
function generateSalesData(startDate, endDate, productCount = 50, userCount = 50) {
    const sales = [];
    const endDateTime = endDate.getTime();
    const startDateTime = startDate.getTime();
    const dayDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    
    // Initialize a counter for the sales id
    let salesId = 1;
    
    // Skip days
    const skipDays = startDate.getDay() === 0 ? 0 : 7 - startDate.getDay();
    const effectiveStartDate = new Date(startDateTime + skipDays * dayDuration);
    
    // For each day in our timeframe
    for (let currentDate = new Date(effectiveStartDate); 
         currentDate.getTime() <= endDateTime; 
         currentDate = new Date(currentDate.getTime() + dayDuration)) {
        
        // Factors affecting daily sales
        const weekdayFactor = isWeekend(currentDate) ? 1.5 : 1.0;
        const monthFactor = getMonthFactor(currentDate.getMonth());
        const dayOfMonthFactor = getDayOfMonthFactor(currentDate.getDate());
        const seasonalFactor = getSeasonalFactor(currentDate);
        const holidayFactor = getHolidayFactor(currentDate);
        const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
        
        // Calculate the base number of sales for this day
        let dailySalesCount = Math.floor(20 * weekdayFactor * monthFactor * dayOfMonthFactor * 
                                      seasonalFactor * holidayFactor * randomFactor);
        
        // For each sale on this day
        for (let i = 0; i < dailySalesCount; i++) {
            // Get random product and user
            const userId = Math.floor(Math.random() * userCount) + 1;
            const productId = Math.floor(Math.random() * productCount) + 1;
            
            // Get the actual product
            const product = DATA.products.find(p => p.id === productId);
            
            // Skip if product doesn't exist
            if (!product) continue;
            
            // Random time during the day
            const hour = Math.floor(Math.random() * 24);
            const minute = Math.floor(Math.random() * 60);
            const second = Math.floor(Math.random() * 60);
            
            const saleDate = new Date(currentDate);
            saleDate.setHours(hour, minute, second);
            
            // Random quantity
            const quantity = Math.floor(Math.random() * 3) + 1;
            
            // Calculate sale price with possible discount
            const discount = Math.random() > 0.7 ? 0.1 + Math.random() * 0.2 : 0;
            const salePrice = product.price * (1 - discount);
            const totalPrice = salePrice * quantity;
            
            // Create the sale record
            sales.push({
                id: salesId++,
                user_id: userId,
                product_id: productId,
                product_name: product.name,
                date: saleDate,
                quantity: quantity,
                purchase_amount: parseFloat(totalPrice.toFixed(2)),
                category_id: product.category.id,
                category_name: product.category.name
            });
        }
    }
    
    return sales;
}

// Helper function to check if date is the nth weekday of month
function isNthDayOfMonth(date, weekday, n) {
    const d = new Date(date);
    let count = 0;
    for (let i = 1; i <= d.getDate(); i++) {
        const day = new Date(d.getFullYear(), d.getMonth(), i).getDay();
        if (day === weekday) count++;
        if (count === n && d.getDate() === i) return true;
    }
    return false;
}

// Helper function to check if date is after the nth weekday of month
function isAfterNthDayOfMonth(date, weekday, n) {
    const d = new Date(date);
    let count = 0;
    let targetDate = null;
    for (let i = 1; i <= 31; i++) {
        if (i > 28 && d.getMonth() === 1) break; // Skip invalid February dates
        const checkDate = new Date(d.getFullYear(), d.getMonth(), i);
        if (checkDate.getMonth() !== d.getMonth()) break; // End of month reached
        
        const day = checkDate.getDay();
        if (day === weekday) count++;
        if (count === n) {
            targetDate = checkDate;
            break;
        }
    }
    
    return targetDate && d > targetDate;
}

// Helper function to get a random date between two dates
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random age group
function getRandomAgeGroup() {
    const groups = ["0-17", "18-25", "26-35", "36-45", "46-55", "56-65", "65+"];
    const weights = [0.05, 0.15, 0.25, 0.25, 0.15, 0.1, 0.05]; // Weight distribution
    
    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative) return groups[i];
    }
    return groups[groups.length - 1];
}

// Helper function to generate price based on product category
function generatePriceForCategory(category) {
    switch (category) {
        case 1: // Electronics
            return 50 + Math.random() * 950; // $50-$1000
        case 2: // Clothing
            return 10 + Math.random() * 90; // $10-$100
        case 3: // Home & Kitchen
            return 20 + Math.random() * 280; // $20-$300
        case 4: // Beauty & Personal Care
            return 5 + Math.random() * 95; // $5-$100
        case 5: // Books & Media
            return 5 + Math.random() * 45; // $5-$50
        case 6: // Sports & Outdoors
            return 15 + Math.random() * 185; // $15-$200
        case 7: // Toys & Games
            return 10 + Math.random() * 90; // $10-$100
        case 8: // Groceries
            return 2 + Math.random() * 28; // $2-$30
        case 9: // Furniture
            return 100 + Math.random() * 900; // $100-$1000
        case 10: // Automotive
            return 25 + Math.random() * 375; // $25-$400
        default:
            return 10 + Math.random() * 90; // $10-$100
    }
}

// Helper functions for sales data generation
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

function getMonthFactor(month) {
    const monthFactors = [
        0.8,  // January
        0.7,  // February
        0.9,  // March
        1.0,  // April
        1.1,  // May
        1.2,  // June
        1.3,  // July
        1.25, // August
        1.0,  // September
        1.1,  // October
        1.4,  // November (Black Friday)
        1.6   // December (Holiday season)
    ];
    return monthFactors[month];
}

function getDayOfMonthFactor(day) {
    // Sales tend to be higher at the beginning of the month (after paycheck)
    // and lower towards the end
    if (day <= 5) return 1.3;      // Beginning of month (after payday)
    if (day >= 25) return 0.8;     // End of month (before payday)
    return 1.0;                    // Mid-month
}

function getSeasonalFactor(date) {
    const month = date.getMonth();
    // Spring: March-May
    if (month >= 2 && month <= 4) return 1.1;
    // Summer: June-August
    if (month >= 5 && month <= 7) return 1.2;
    // Fall: September-November
    if (month >= 8 && month <= 10) return 1.0;
    // Winter: December-February
    return 1.3; // Higher for holiday season
}

function getHolidayFactor(date) {
    const month = date.getMonth();
    const day = date.getDate();
    
    // Major shopping holidays
    // Black Friday (day after Thanksgiving - 4th Friday in November)
    if (month === 10 && isBlackFriday(date)) return 2.5;
    
    // Cyber Monday (Monday after Thanksgiving)
    if (month === 10 && isCyberMonday(date)) return 2.0;
    
    // Christmas shopping season
    if (month === 11 && day >= 15 && day <= 24) return 1.8;
    
    // Valentine's Day
    if (month === 1 && day === 14) return 1.5;
    
    // Mother's Day (2nd Sunday in May)
    if (month === 4 && isSecondSunday(date)) return 1.6;
    
    // Father's Day (3rd Sunday in June)
    if (month === 5 && isThirdSunday(date)) return 1.4;
    
    // Back to school (August)
    if (month === 7 && day >= 15) return 1.5;
    
    return 1.0; // No holiday
}

function isBlackFriday(date) {
    const month = date.getMonth();
    const day = date.getDay(); // 0-6, where 0 is Sunday
    const dateOfMonth = date.getDate();
    
    // Black Friday is the day after the 4th Thursday in November
    if (month !== 10) return false; // Not November
    if (day !== 5) return false;    // Not Friday
    
    // Check if it's the 4th Friday of November
    const firstDayOfMonth = new Date(date.getFullYear(), month, 1).getDay();
    const firstFriday = (firstDayOfMonth <= 5) ? (6 - firstDayOfMonth) : (13 - firstDayOfMonth);
    const fourthFriday = firstFriday + 21; // 3 weeks after first Friday
    
    return dateOfMonth === fourthFriday;
}

function isCyberMonday(date) {
    const month = date.getMonth();
    const day = date.getDay(); // 0-6, where 0 is Sunday
    const dateOfMonth = date.getDate();
    
    // Cyber Monday is the Monday after Black Friday
    if (month !== 10) return false; // Not November
    if (day !== 1) return false;    // Not Monday
    
    // Calculate the date of the 4th Thursday in November (Thanksgiving)
    const firstDayOfMonth = new Date(date.getFullYear(), month, 1).getDay();
    const firstThursday = (firstDayOfMonth <= 4) ? (5 - firstDayOfMonth) : (12 - firstDayOfMonth);
    const fourthThursday = firstThursday + 21; // 3 weeks after first Thursday
    
    // Cyber Monday is 4 days after Thanksgiving
    return dateOfMonth === fourthThursday + 4;
}

function isSecondSunday(date) {
    const day = date.getDay(); // 0-6, where 0 is Sunday
    const dateOfMonth = date.getDate();
    
    if (day !== 0) return false; // Not Sunday
    
    // Calculate the date of the first Sunday
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const firstSunday = (firstDayOfMonth === 0) ? 1 : (8 - firstDayOfMonth);
    const secondSunday = firstSunday + 7;
    
    return dateOfMonth === secondSunday;
}

function isThirdSunday(date) {
    const day = date.getDay(); // 0-6, where 0 is Sunday
    const dateOfMonth = date.getDate();
    
    if (day !== 0) return false; // Not Sunday
    
    // Calculate the date of the first Sunday
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const firstSunday = (firstDayOfMonth === 0) ? 1 : (8 - firstDayOfMonth);
    const thirdSunday = firstSunday + 14;
    
    return dateOfMonth === thirdSunday;
}

// Helper function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Data Access Functions
window.DataService = {
    // Get all sales in a date range
    getSales: function(startDate, endDate) {
        // Handle case where dates might be strings
        const start = startDate instanceof Date ? startDate : new Date(startDate);
        const end = endDate instanceof Date ? endDate : new Date(endDate);
        
        // Set end date to end of day
        end.setHours(23, 59, 59, 999);
        
        // Filter sales by date range
        return DATA.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= start && saleDate <= end;
        });
    },
    
    // Get sales aggregated by day
    getSalesByDay: function(startDate, endDate) {
        const sales = this.getSales(startDate, endDate);
        const dailySales = {};
        
        sales.forEach(sale => {
            const dateStr = new Date(sale.date).toISOString().split('T')[0];
            if (!dailySales[dateStr]) {
                dailySales[dateStr] = {
                    date: dateStr,
                    total: 0,
                    count: 0
                };
            }
            
            dailySales[dateStr].total += sale.purchase_amount;
            dailySales[dateStr].count += 1;
        });
        
        return Object.values(dailySales).sort((a, b) => new Date(a.date) - new Date(b.date));
    },
    
    // Get sales aggregated by week
    getSalesByWeek: function(startDate, endDate) {
        const sales = this.getSales(startDate, endDate);
        const weeklySales = {};
        
        sales.forEach(sale => {
            const saleDate = new Date(sale.date);
            const weekStart = new Date(saleDate);
            weekStart.setDate(saleDate.getDate() - saleDate.getDay());
            const weekKey = weekStart.toISOString().split('T')[0];
            
            if (!weeklySales[weekKey]) {
                weeklySales[weekKey] = {
                    week: weekKey,
                    total: 0,
                    count: 0
                };
            }
            
            weeklySales[weekKey].total += sale.purchase_amount;
            weeklySales[weekKey].count += 1;
        });
        
        return Object.values(weeklySales).sort((a, b) => new Date(a.week) - new Date(b.week));
    },
    
    // Get sales aggregated by month
    getSalesByMonth: function(startDate, endDate) {
        const sales = this.getSales(startDate, endDate);
        const monthlySales = {};
        
        sales.forEach(sale => {
            const saleDate = new Date(sale.date);
            const monthKey = `${saleDate.getFullYear()}-${(saleDate.getMonth() + 1).toString().padStart(2, '0')}`;
            
            if (!monthlySales[monthKey]) {
                monthlySales[monthKey] = {
                    month: monthKey,
                    total: 0,
                    count: 0
                };
            }
            
            monthlySales[monthKey].total += sale.purchase_amount;
            monthlySales[monthKey].count += 1;
        });
        
        return Object.values(monthlySales).sort((a, b) => a.month.localeCompare(b.month));
    },
    
    // Get sales grouped by category
    getSalesByCategory: function(startDate, endDate) {
        const filteredSales = this.getSales(startDate, endDate);
        
        // Create a map to store totals by category
        const categoryTotals = {};
        
        // Process each sale and add to category total
        filteredSales.forEach(sale => {
            const categoryId = sale.category_id;
            
            if (!categoryTotals[categoryId]) {
                categoryTotals[categoryId] = {
                    id: categoryId,
                    name: sale.category_name,
                    total: 0,
                    count: 0
                };
            }
            
            categoryTotals[categoryId].total += sale.purchase_amount;
            categoryTotals[categoryId].count += sale.quantity;
        });
        
        // Convert to array and sort by total in descending order
        return Object.values(categoryTotals).sort((a, b) => b.total - a.total);
    },
    
    // Get top selling products
    getTopProducts: function(startDate, endDate, limit = 10) {
        const filteredSales = this.getSales(startDate, endDate);
        
        // Create a map to store product sales data
        const productSales = {};
        
        // Process each sale and add to product totals
        filteredSales.forEach(sale => {
            const productId = sale.product_id;
            
            if (!productSales[productId]) {
                // Find the product
                const product = DATA.products.find(p => p.id === productId);
                
                productSales[productId] = {
                    id: productId,
                    name: product ? product.name : sale.product_name,
                    total: 0,
                    count: 0,
                    category: product && product.category ? product.category.name : sale.category_name
                };
            }
            
            productSales[productId].total += sale.purchase_amount;
            productSales[productId].count += sale.quantity;
        });
        
        // Convert to array, sort by total sales amount, and take the top N
        return Object.values(productSales)
            .sort((a, b) => b.total - a.total)
            .slice(0, limit);
    },
    
    // Get gender distribution
    getGenderDistribution: function(startDate, endDate) {
        const sales = this.getSales(startDate, endDate);
        const genders = { Male: 0, Female: 0 };
        
        // Get unique users who made purchases
        const userIds = [...new Set(sales.map(sale => sale.user_id))];
        
        userIds.forEach(userId => {
            const user = this.getUser(userId);
            if (user && user.gender) {
                genders[user.gender]++;
            }
        });
        
        return [
            { gender: 'Male', count: genders.Male },
            { gender: 'Female', count: genders.Female }
        ];
    },
    
    // Get age distribution
    getAgeDistribution: function(startDate, endDate) {
        const sales = this.getSales(startDate, endDate);
        const ages = {
            "0-17": 0,
            "18-25": 0,
            "26-35": 0,
            "36-45": 0,
            "46-55": 0,
            "56-65": 0,
            "65+": 0
        };
        
        // Get unique users who made purchases
        const userIds = [...new Set(sales.map(sale => sale.user_id))];
        
        userIds.forEach(userId => {
            const user = this.getUser(userId);
            if (user && user.age !== undefined) {
                // Determine age group
                let ageBin;
                if (user.age < 18) ageBin = "0-17";
                else if (user.age <= 25) ageBin = "18-25";
                else if (user.age <= 35) ageBin = "26-35";
                else if (user.age <= 45) ageBin = "36-45";
                else if (user.age <= 55) ageBin = "46-55";
                else if (user.age <= 65) ageBin = "56-65";
                else ageBin = "65+";
                
                ages[ageBin]++;
            }
        });
        
        // Convert to array and sort by age group
        const ageGroups = ["0-17", "18-25", "26-35", "36-45", "46-55", "56-65", "65+"];
        return ageGroups.map(group => ({
            age_group: group,
            count: ages[group] || 0
        }));
    },
    
    // Get city category distribution
    getCityCategoryDistribution: function(startDate, endDate) {
        const sales = this.getSales(startDate, endDate);
        const cities = { A: 0, B: 0, C: 0 };
        
        // Map each sale to its user's city category
        sales.forEach(sale => {
            const user = this.getUser(sale.user_id);
            if (user && user.city_category) {
                cities[user.city_category]++;
            }
        });
        
        return [
            { category: 'A', count: cities.A, name: DATA.cities.A.name },
            { category: 'B', count: cities.B, name: DATA.cities.B.name },
            { category: 'C', count: cities.C, name: DATA.cities.C.name }
        ];
    },
    
    // Get user by ID
    getUser: function(userId) {
        return DATA.users.find(user => user.id === userId);
    },
    
    // Get a single product by ID
    getProduct: function(productId) {
        return DATA.products.find(product => product.id === productId);
    },
    
    // Get all products in a category
    getProductsByCategory: function(categoryId) {
        return DATA.products.filter(product => product.category.id === categoryId);
    },
    
    // Get customer lifetime value
    getCustomerLTV: function() {
        const userPurchases = {};
        
        DATA.sales.forEach(sale => {
            if (!userPurchases[sale.user_id]) {
                userPurchases[sale.user_id] = {
                    userId: sale.user_id,
                    total: 0,
                    purchases: 0,
                    firstPurchase: new Date(sale.date),
                    lastPurchase: new Date(sale.date)
                };
            }
            
            userPurchases[sale.user_id].total += sale.purchase_amount;
            userPurchases[sale.user_id].purchases++;
            
            const purchaseDate = new Date(sale.date);
            if (purchaseDate < userPurchases[sale.user_id].firstPurchase) {
                userPurchases[sale.user_id].firstPurchase = purchaseDate;
            }
            if (purchaseDate > userPurchases[sale.user_id].lastPurchase) {
                userPurchases[sale.user_id].lastPurchase = purchaseDate;
            }
        });
        
        // Calculate LTV metrics
        return Object.values(userPurchases).map(user => {
            const lifetime = (user.lastPurchase - user.firstPurchase) / (1000 * 60 * 60 * 24) + 1; // in days, minimum 1
            return {
                userId: user.userId,
                totalSpent: user.total,
                purchaseCount: user.purchases,
                avgOrderValue: user.total / user.purchases,
                purchaseFrequency: user.purchases / (lifetime / 30), // per month
                ltv: user.total * (1 + 0.1 * (lifetime / 365)) // Simple LTV model with 10% annual growth potential
            };
        });
    },
    
    // Generate sales forecast based on historical data
    generateForecast: function(days = 30) {
        const dailySales = this.getSalesByDay(
            new Date(new Date().setDate(new Date().getDate() - 90)), // last 90 days
            new Date()
        );
        
        // Calculate average daily sales and standard deviation
        const values = dailySales.map(day => day.total);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        // Generate forecast with trend and seasonality
        const forecast = [];
        const lastDate = new Date(dailySales[dailySales.length - 1].date);
        const trend = 0.002; // Small upward trend
        
        for (let i = 1; i <= days; i++) {
            const forecastDate = new Date(lastDate);
            forecastDate.setDate(lastDate.getDate() + i);
            
            // Apply weekly seasonality
            const dayOfWeek = forecastDate.getDay();
            const weekdayFactor = [0.8, 0.7, 0.75, 0.8, 0.9, 1.3, 1.5][dayOfWeek];
            
            // Apply monthly seasonality
            const month = forecastDate.getMonth();
            const monthFactor = [0.8, 0.7, 0.9, 1.0, 1.1, 1.2, 1.3, 1.25, 1.0, 1.1, 1.4, 1.6][month];
            
            // Apply trend
            const trendFactor = 1 + (trend * i);
            
            // Calculate forecasted value with some randomness
            const randomness = (Math.random() * 2 - 1) * (stdDev * 0.3);
            const forecastValue = avg * weekdayFactor * monthFactor * trendFactor + randomness;
            
            forecast.push({
                date: forecastDate.toISOString().split('T')[0],
                predicted: Math.max(0, forecastValue),
                lower: Math.max(0, forecastValue - stdDev * 0.5),
                upper: forecastValue + stdDev * 0.5
            });
        }
        
        return forecast;
    },
    
    // Get sales trend data (daily, weekly, monthly)
    getSalesTrend: function(startDate, endDate, interval = 'daily') {
        const filteredSales = this.getSales(startDate, endDate);
        
        // Group sales by the specified interval
        const salesByDate = {};
        
        filteredSales.forEach(sale => {
            const saleDate = new Date(sale.date);
            let dateKey;
            
            // Format the date according to the interval
            if (interval === 'daily') {
                dateKey = formatDate(saleDate);
            } else if (interval === 'weekly') {
                const weekStart = new Date(saleDate);
                weekStart.setDate(saleDate.getDate() - saleDate.getDay()); // Start of week (Sunday)
                dateKey = formatDate(weekStart);
            } else if (interval === 'monthly') {
                dateKey = `${saleDate.getFullYear()}-${(saleDate.getMonth() + 1).toString().padStart(2, '0')}`;
            }
            
            if (!salesByDate[dateKey]) {
                salesByDate[dateKey] = {
                    date: dateKey,
                    total: 0,
                    count: 0
                };
            }
            
            salesByDate[dateKey].total += sale.purchase_amount;
            salesByDate[dateKey].count += sale.quantity;
        });
        
        // Convert to array and sort by date
        return Object.values(salesByDate).sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
    },
    
    // Get sales by category over time
    getSalesByCategoryAndTime: function(startDate, endDate, interval = 'monthly') {
        const filteredSales = this.getSales(startDate, endDate);
        
        // Get all unique categories
        const categories = {};
        filteredSales.forEach(sale => {
            const categoryId = sale.category_id;
            if (!categories[categoryId]) {
                categories[categoryId] = {
                    id: categoryId,
                    name: sale.category_name
                };
            }
        });
        
        // Get time periods
        const timeData = {};
        
        filteredSales.forEach(sale => {
            const saleDate = new Date(sale.date);
            let timeKey;
            
            // Format the date according to the interval
            if (interval === 'daily') {
                timeKey = formatDate(saleDate);
            } else if (interval === 'weekly') {
                const weekStart = new Date(saleDate);
                weekStart.setDate(saleDate.getDate() - saleDate.getDay()); // Start of week (Sunday)
                timeKey = formatDate(weekStart);
            } else if (interval === 'monthly') {
                timeKey = `${saleDate.getFullYear()}-${(saleDate.getMonth() + 1).toString().padStart(2, '0')}`;
            }
            
            // Initialize time period if it doesn't exist
            if (!timeData[timeKey]) {
                timeData[timeKey] = {
                    period: timeKey,
                    categories: {}
                };
                
                // Initialize all categories with zero values
                Object.values(categories).forEach(category => {
                    timeData[timeKey].categories[category.id] = {
                        id: category.id,
                        name: category.name,
                        total: 0
                    };
                });
            }
            
            // Add sale amount to the right category
            const categoryId = sale.category_id;
            timeData[timeKey].categories[categoryId].total += sale.purchase_amount;
        });
        
        // Format the data for the chart
        const timePeriods = Object.keys(timeData).sort();
        const categoryIds = Object.keys(categories);
        
        const result = {
            labels: timePeriods,
            datasets: categoryIds.map(categoryId => {
                const category = categories[categoryId];
                const color = getRandomColor();
                
                return {
                    label: category.name,
                    data: timePeriods.map(period => timeData[period].categories[categoryId].total),
                    borderColor: color,
                    backgroundColor: color + '20'
                };
            })
        };
        
        return result;
    },
};

// Fix formatDate to be a standalone function, not a method of DataService
function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Initialize data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Create empty structures first
    DATA.users = [];
    DATA.sales = [];
    DATA.products = [];
    
    // Initialize with more realistic volumes of data
    DATA.users = generateUsers(100);
    DATA.products = generateProducts(100);
    DATA.sales = generateSalesData(new Date(2023, 0, 1), new Date(), 100, 100);
    
    console.log(`Data initialized with ${DATA.users.length} users, ${DATA.products.length} products, and ${DATA.sales.length} sales records.`);
}); 