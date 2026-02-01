import 'dotenv/config';
import { ProductService } from '../src/services/ProductService.js';

async function getProduct() {
  const svc = new ProductService();
  const product = await svc.getProductById(4);
  
  if (product) {
    console.log(JSON.stringify(product, null, 2));
  } else {
    console.log('Product not found');
  }
  
  process.exit(0);
}

getProduct().catch(err => {
  console.error(err);
  process.exit(1);
});
