function reverseString(str) {
    return str.split('').reverse().join('');
}

async function main() {
    if (figma.currentPage.selection.length !== 1) {
        return 'Select a text field.';
    }

    const node = figma.currentPage.selection[0];
    if (node.type !== 'TEXT') {
        return 'Select a text field.';
    }

    await Promise.all(
        node
            .getRangeAllFontNames(0, node.characters.length)
            .map(figma.loadFontAsync)
    );

    let textToFlip, startIdx;

    const textRange = figma.currentPage.selectedTextRange;
    if (!textRange || textRange.start === textRange.end) {
        textToFlip = node.characters;
        startIdx = 0;
        node.characters = '';
    } else {
        startIdx = textRange.start;
        textToFlip = node.characters
            .split('')
            .slice(textRange.start, textRange.end)
            .join('');

        node.deleteCharacters(textRange.start, textRange.end);
    }

    node.insertCharacters(startIdx, reverseString(textToFlip));

    // fix layer name
    node.name = reverseString(node.characters);

    return 'Text reversed';
}

main().then((message) => figma.closePlugin(message));
