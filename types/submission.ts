/**
 * Overlay is a type that represents an overlay on the submission.
 */
export interface Overlay {
    overlay_id?: string;
    overlay_type: 'text';
    content: string;
    x: number;
    y: number;
}