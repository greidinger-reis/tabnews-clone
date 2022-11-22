export type editorState = {
    isSubmitting: boolean;
    isFullscreen: boolean;
    isHelpTabShown: boolean;
    isPreviewTabShown: boolean;
};

export const INITIAL_STATE: editorState = {
    isSubmitting: false,
    isFullscreen: false,
    isHelpTabShown: false,
    isPreviewTabShown: false,
};

export type editorActions = {
    type:
        | "TOGGLE_FULLSCREEN"
        | "TOGGLE_HELP_TAB"
        | "TOGGLE_PREVIEW_TAB"
        | "TOGGLE_IS_SUBMITTING";
};

export function editorReducer(state: editorState, action: editorActions) {
    switch (action.type) {
        case "TOGGLE_FULLSCREEN":
            return { ...state, isFullscreen: !state.isFullscreen };
        case "TOGGLE_HELP_TAB":
            return { ...state, isHelpTabShown: !state.isHelpTabShown };
        case "TOGGLE_PREVIEW_TAB":
            return { ...state, isPreviewTabShown: !state.isPreviewTabShown };
        case "TOGGLE_IS_SUBMITTING":
            return { ...state, isSubmitting: !state.isSubmitting };
        default:
            return state;
    }
}
