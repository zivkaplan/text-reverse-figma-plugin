var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function reverseString(str) {
    return str.split('').reverse().join('');
}
function ActivatePlugin(node) {
    node.autoRename = false;
    let textToFlip, startIdx;
    const textRange = figma.currentPage.selectedTextRange;
    if (!textRange || textRange.start === textRange.end) {
        textToFlip = node.characters;
        node.characters = '';
        startIdx = 0;
    }
    else {
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (figma.currentPage.selection.length !== 1) {
            return 'Select a text field.';
        }
        const node = figma.currentPage.selection[0];
        if (node.type !== 'TEXT') {
            return 'Select a text field.';
        }
        const res = Promise.all(node
            .getRangeAllFontNames(0, node.characters.length)
            .map(figma.loadFontAsync))
            .then(() => ActivatePlugin(node))
            .catch((e) => {
            console.log(e.message);
            return 'Cannot load fonts';
        });
        return res;
    });
}
main().then((message) => figma.closePlugin(message));
