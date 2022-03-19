import * as React from 'react';
export function buildTags(tags, isDisabled = false, isInline = false) {
    return (tags && (React.createElement("music-tag-group", { slot: "tags" }, tags.map((tag) => (React.createElement("music-tag", { key: tag, disabled: isDisabled, inline: isInline }, tag))))));
}
