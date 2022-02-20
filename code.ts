function reverseString(str) {
    return str.split('').reverse().join('');
}
function ActivatePlugin(node) {
    node.autoRename = false;

    let textToFlip, startIdx;
    const emptyString = '';

    const textRange = figma.currentPage.selectedTextRange;
    if (!textRange || textRange.start === textRange.end) {
        textToFlip = node.characters;
        node.characters = '';
        startIdx = 0;
    } else {
        startIdx = textRange.start;
        textToFlip = node.characters
            .split('')
            .slice(textRange.start, textRange.end)
            .join('');

        node.deleteCharacters(textRange.start, textRange.end);
    }

    node.insertCharacters(startIdx, reverseString(textToFlip));
    return 'Text reversed';
}
async function main() {
    if (figma.currentPage.selection.length !== 1) {
        return 'Select a text field.';
    }

    const node = figma.currentPage.selection[0];
    if (node.type !== 'TEXT') {
        return 'Select a text field.';
    }

    const res = Promise.all(
        node
            .getRangeAllFontNames(0, node.characters.length)
            .map(figma.loadFontAsync)
    )
        .then(() => ActivatePlugin(node))
        .catch((e) => {
            console.log(e.message);
            return 'Cannot load fonts';
        });

    return res;
}

main().then((message) => figma.closePlugin(message));
