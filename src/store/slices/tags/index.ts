
// Export everything from the slice
import tagsReducer from './tagsSlice';
import * as tagsActions from './actions';
import * as tagsSelectors from './selectors';

export { tagsReducer, tagsActions, tagsSelectors };

// Export specific selectors for convenience (avoiding duplications)
export { 
  selectTagById,
  selectTagsByEntity,
  selectTagsLoading,
  selectTagsError,
  selectTagsTotal,
  selectTagsCurrentPage,
  selectTagsItemsPerPage,
  selectTagsSortField,
  selectTagsSortDirection,
  selectTagsFilterEntity,
  selectTagsSearchQuery,
  selectSelectedTags
} from './selectors';

// Export specific actions for convenience (avoiding duplicates)
export {
  fetchTags,
  createTag,
  updateTag,
  deleteTags,
  setPage,
  setSort,
  setFilter,
  setSearch,
  selectTag,
  clearSelectedTags
} from './actions';

// Add this line to export selectAllTags
export { selectAllTags } from './selectors';

export default tagsReducer;
