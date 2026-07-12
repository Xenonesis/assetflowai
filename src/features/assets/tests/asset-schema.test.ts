import { describe, it, expect } from 'vitest';
import { assetSchema } from '../validators/asset-schemas';

describe('Asset Schema Validation', () => {
  it('validates a correct asset object', () => {
    const validAsset = {
      asset_tag: 'AF-LT-001',
      name: 'MacBook Pro',
      category_id: '123e4567-e89b-12d3-a456-426614174000',
      department_id: '123e4567-e89b-12d3-a456-426614174001',
      status: 'available',
      condition: 'good',
    };
    
    const result = assetSchema.safeParse(validAsset);
    expect(result.success).toBe(true);
  });

  it('fails if asset_tag is missing', () => {
    const invalidAsset = {
      name: 'MacBook Pro',
      category_id: '123e4567-e89b-12d3-a456-426614174000',
      department_id: '123e4567-e89b-12d3-a456-426614174001',
    };
    
    const result = assetSchema.safeParse(invalidAsset);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path[0]).toBe('asset_tag');
    }
  });

  it('fails if UUID is invalid', () => {
    const invalidAsset = {
      asset_tag: 'AF-LT-001',
      name: 'MacBook Pro',
      category_id: 'invalid-uuid',
      department_id: '123e4567-e89b-12d3-a456-426614174001',
    };
    
    const result = assetSchema.safeParse(invalidAsset);
    expect(result.success).toBe(false);
  });
});
