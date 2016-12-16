function _addSourceProps(source) {
    source._id = source.id;
    source.added = true;
    delete source.id;
}

export function markFBSourcesAsAdded(sources, sourcesToConfigure) {
    if(sources.length === sourcesToConfigure.length) {
        return sourcesToConfigure.map(source => {
            if(!source._id) {
                _addSourceProps(source);
            }
            return source;
        });
    }
    let [sourceToConfigure] = sourcesToConfigure;
    let addedSource = sources.find(source => source.id === sourceToConfigure.id);
    _addSourceProps(addedSource);
    return sources;
}
