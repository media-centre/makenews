function _addSourceProps(source, propertyToCompare) {
    source._id = source[propertyToCompare];
    source.added = true;
}

export function markSourcesAsAdded(sources, sourcesToConfigure, propertyToCompare) {
    if(sourcesToConfigure.length === 1 && sources.length) { //eslint-disable-line no-magic-numbers
        const [sourceToConfigure] = sourcesToConfigure;
        const addedSource = sources.find(source => source[propertyToCompare] === sourceToConfigure[propertyToCompare]);
        if(addedSource) {
            _addSourceProps(addedSource, propertyToCompare);
            return sources;
        }
    } else if(sourcesToConfigure.length > 1) { //eslint-disable-line no-magic-numbers
        return sources.map(source => {
            if (!source.added) {
                _addSourceProps(source, propertyToCompare);
            }
            return source;
        });
    }
    return [];
}

export function unmarkDeletedSource(sources, sourceToDelete) {
    return (sources.map((source) => {
        if(source.id === sourceToDelete || source._id === sourceToDelete || source.url === sourceToDelete) {
            source.added = false;
        }
        return source;
    }));
}
