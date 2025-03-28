
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Tag } from '@/types/tag';
import { tagService } from '@/api/services/tagService';

// Fetch tags with pagination and filtering
export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (params: any) => {
    try {
      const response = await tagService.fetchTags(params);
      return {
        tags: response.data,
        total: response.total || response.data.length
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tags');
    }
  }
);

// Create a new tag
export const createTag = createAsyncThunk(
  'tags/createTag',
  async (tag: Partial<Tag>) => {
    try {
      const response = await tagService.createTag(tag);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create tag');
    }
  }
);

// Update an existing tag
export const updateTag = createAsyncThunk(
  'tags/updateTag',
  async ({ id, tag }: { id: string; tag: Partial<Tag> }) => {
    try {
      const response = await tagService.updateTag(id, tag);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update tag');
    }
  }
);

// Delete multiple tags
export const deleteTags = createAsyncThunk(
  'tags/deleteTags', 
  async (ids: string[]) => {
    try {
      await tagService.deleteTags(ids);
      return ids;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete tags');
    }
  }
);
