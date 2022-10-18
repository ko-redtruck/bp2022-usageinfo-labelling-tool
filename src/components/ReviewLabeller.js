const React = require('react');
const Highlighter = require('web-highlighter');

export class ReviewLabeller extends React.Component{
    constructor(props){
        super(props);

        this.setupHighlighter();
        this.reviewRef = React.createRef();

    }

    setupHighlighter = () => {
        this.highlighter = new Highlighter({
            exceptSelectors: ['h1','pre', 'code']
        });
        // add some listeners to handle interaction, such as hover
        this.highlighter
        .on('selection:hover', ({id}) => {
            // display different bg color when hover
            this.highlighter.addClass('highlight-wrap-hover', id);
        })
        .on('selection:hover-out', ({id}) => {
            // remove the hover effect when leaving
            this.highlighter.removeClass('highlight-wrap-hover', id);
        })
        .on('selection:create', ({sources}) => {
            sources = sources.map(hs => ({hs}));
            // save to backend
            this.store.save(sources);
        });

        // auto-highlight selections
        this.highlighter.run()
    }

    resetSelection = () => {
        this.highlighter.removeAll();
    }


    //web-highligther renders all highlighted text in spans. We write the review inside a paragraph, so we have to search for text inside spans
    indexOfSpanInParagraph = (p, text, searchStartPosition) => {
        let index = 0;
        for(let i = 0; i < p.childNodes.length; i++){
            let element = p.childNodes[i];
            if(element.nodeName === '#text'){
                
                index += element.length;
            }
            else if(element.nodeName === 'SPAN'){
                if(element.innerText === text && index >= searchStartPosition){
                    return index;
                }
                else{
                    
                    index += element.innerText.length;
                }
            }
        };

        return -1;
        
    }

    saveSelection = () => {
        const selections = [];
        let currentSearchPosition = 0;
        //get selections
        this.highlighter.getDoms().forEach(element => {
            if(element.textContent !== ''){
                const selectionIndex = this.indexOfSpanInParagraph(this.reviewRef.current, element.textContent, currentSearchPosition);
                const endIndex = selectionIndex + element.textContent.length - 1;
                selections.push({
                    text: element.textContent,
                    startIndex: selectionIndex,
                    endIndex: endIndex
                });
                currentSearchPosition = endIndex + 1;
            }
            
        });

        console.log(selections);
        const mergedSelections = this.mergeSelections(selections);
        console.log('merged',mergedSelections);

    }

    mergeSelections = (selections) => {
        if(selections.length === 0){
            return [];
        }
        const mergedSelections = [selections[0]];
        let i = 0;
        let mergedIndex = 0;
        while (i < selections.length - 1) {
            const currentSelection = mergedSelections[mergedIndex];
            const nextSelection = selections[i + 1];
            if(currentSelection.endIndex + 1 === nextSelection.startIndex){
                const mergedSelection = {
                    text: currentSelection.text + nextSelection.text,
                    startIndex: currentSelection.startIndex,
                    endIndex: nextSelection.endIndex
                };
                mergedSelections[mergedIndex] = mergedSelection;
                i++;
                
            }
            else{
                mergedSelections.push(nextSelection);
                mergedIndex++;
                i++;
            }
        }
        return mergedSelections;
    }
    
    render(){
        return (<>
            {this.props.children}
            <p ref={this.reviewRef}>{this.props.review}</p>
            <button onClick={this.resetSelection}>
                Reset
            </button>
            <button onClick={this.saveSelection}>
                Save
            </button>
        </>);
    }
}