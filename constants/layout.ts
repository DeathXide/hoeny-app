import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/** Horizontal padding for screen containers */
export const SCREEN_PADDING = 16;

/** Height of the bottom tab bar */
export const TAB_BAR_HEIGHT = 64;

/** Standard header height */
export const HEADER_HEIGHT = 56;

/** Standard spacing between cards/sections */
export const CARD_GAP = 12;

/** Standard card border radius */
export const CARD_RADIUS = 12;

/** Standard button height */
export const BUTTON_HEIGHT = 48;

/** Standard input field height */
export const INPUT_HEIGHT = 48;

/** Bottom sheet handle area height */
export const BOTTOM_SHEET_HANDLE_HEIGHT = 24;

/** Width/height of product thumbnail images */
export const PRODUCT_IMAGE_SIZE = 80;

/** Width/height of product card images in grid view */
export const PRODUCT_CARD_IMAGE_SIZE = 120;

export { SCREEN_WIDTH, SCREEN_HEIGHT };
