import 'dotenv/config';
import { ProductService } from '../src/services/ProductService.js';

async function listProducts() {
    const svc = new ProductService();
    const products = await svc.listProducts(5, 0);

    console.log(JSON.stringify(products, null, 2));
    console.log(`\nTotal: ${products.length} products`);

    process.exit(0);
}

listProducts().catch(err => {
    console.error(err);
    process.exit(1);
});
