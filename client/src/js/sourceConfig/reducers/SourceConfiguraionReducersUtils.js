function _addSourceProps(source, propertyToCompare) {
    source._id = source[propertyToCompare];
    source.added = true;
}

export function markSourcesAsAdded(sources, sourcesToConfigure, propertyToCompare) {
    if(sourcesToConfigure.length > 1) { //eslint-disable-line no-magic-numbers
        return sources.map(source => {
            if(!source.added) {
                _addSourceProps(source, propertyToCompare);
            }
            return source;
        });
    }
    let [sourceToConfigure] = sourcesToConfigure;
    let addedSource = sources.find(source => source[propertyToCompare] === sourceToConfigure[propertyToCompare]);
    _addSourceProps(addedSource, propertyToCompare);
    return sources;
}
