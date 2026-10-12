import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const db = await getDb();

    if (req.method === 'GET') {
      const products = await db.collection('products').find({}).toArray();
      return res.json({ success: true, products });
    }

    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;

      const newProduct = {
        id: `prod-${Date.now()}`,
        title: req.body.title || 'Untitled Jewelry Piece',
        price_pkr: Number(req.body.price_pkr) || 0,
        description: req.body.description || '',
        images: Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images : [],
        stock_quantity: Number(req.body.stock_quantity) || 0,
        category: req.body.category || 'Rings',
        is_published: req.body.is_published !== undefined ? req.body.is_published : true,
        low_stock_threshold: Number(req.body.low_stock_threshold) || 5,
        specs: req.body.specs || {}
      };

      await db.collection('products').insertOne(newProduct);
      return res.status(201).json({ success: true, product: newProduct });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Products error:', error);
    return res.status(500).json({ success: false, message: 'Request failed' });
  }
}