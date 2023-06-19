const modelOptions = {
    toJSON: {
        virtuals: true,
        trasnform: (_, obj) => {
            delete obj.id;
            return obj
        }
    },
    toObject: {
        virtuals: true,
        trasnform: (_, obj) => {
            delete obj.id;
            return obj
        }
    },
    versionKey: false,
    timeStamps: true,
}

export default modelOptions;
