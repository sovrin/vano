import vano, {file} from 'vano';

(async () => {
    // saves collections to a file in ./storage
    const adapter = file('./storage');
    const db = vano({adapter});

    // defines the shape of our characters collection
    const schema = {
        name: '',
        age: 0,
    }

    // creates a collection for characters
    const characters = db.collection('characters', schema);

    // read collection via adapter
    await characters.read();

    // add several characters to collection
    characters.add({name: 'lois griffin', age: 43});
    characters.add({name: 'peter griffin', age: 44});

    // add returns an id
    const id = characters.add({name: 'Consuela', age: Infinity});

    // get character by id
    characters.get(id);

    // update value in id
    characters.update(id, {"age": 53});

    // get all characters with 'griffin' in the name
    characters.query()
        .eq('name', /griffin/)
        .get()
    ;

    // remove character by id
    characters.remove(id);

    // get all characters
    characters.all();

    // get total count of characters
    characters.count();

    // drop characters collection
    characters.reset();

    // save collection via adapter
    await characters.write();
})()