// Import
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import prompt from 'prompt';

const username = "//Alice";

// Construct
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
const api = await ApiPromise.create({ provider: wsProvider });

const keyring = new Keyring({ type: 'sr25519' });
const alice = keyring.addFromUri(username);

// Do something
console.log(api.genesisHash.toHex());

//let extrinsic = api.tx.templateModule.storeMeet("Michael's amazing party", "Pizza included", "England", 500, 7300);

let extrinsic = api.tx.templateModule.registerInterest();

prompt.start();

menu();

function menu() {
    console.log();
    console.log("(V) View events");
    console.log("(H) Host event");
    prompt.get(['action'], function (err, result) {
        if (err) {
            return onErr(err);
        }
        if (result.action.toLowerCase() == "v") {
            console.log();
            console.log(" --- MEET ---");
            api.query.templateModule.meetName().then((res) => {
                if (res.isEmpty) {
                    console.log("No meets registered");
                    menu();
                    return;
                }
                let val = res.unwrap();
                let msg = "";
                val.forEach(v => msg += String.fromCharCode(v));
                console.log("NAME: " + msg);
            });
            api.query.templateModule.meetDescription().then((res) => {
                if (res.isEmpty) return;
                let val = res.unwrap();
                let msg = "";
                val.forEach(v => msg += String.fromCharCode(v));
                console.log("DESCRIPTION: " + msg);
            });
            api.query.templateModule.meetWhere().then((res) => {
                if (res.isEmpty) return;
                let val = res.unwrap();
                let msg = "";
                val.forEach(v => msg += String.fromCharCode(v));
                console.log("WHERE: " + msg);
            });
            api.query.templateModule.meetMin().then((res) => {
                if (res.isEmpty) return;
                let val = res.unwrap();
                console.log("MIN: " + val.toString());
            });
            api.query.templateModule.meetMax().then((res) => {
                if (res.isEmpty) return;
                let val = res.unwrap();
                console.log("MAX: " + val.toString());
            });
            api.query.templateModule.meetInterested().then((res) => {
                if (res.isEmpty) return;
                let val = res.unwrap();
                console.log("INTERESTED: " + val.toString());
                console.log();
                console.log("Register interest? (Y/N)");
                prompt.get(['action'], function (err, result) {
                    if (err) {
                        return onErr(err);
                    }
                    if (result.action.toLowerCase() == "y") {
                        extrinsic.signAndSend(alice);
                        console.log("Interest registered");
                        menu();
                    } else {
                        menu();
                    }
                });
            });
        } else if (result.action.toLowerCase() == "h") {
            prompt.get(['Name', 'Description', 'Where', 'Min_people', 'Max_people'], function (err, result) {
                if (err) {
                    return onErr(err);
                }
                let hostEvent = api.tx.templateModule.storeMeet(result.Name, result.Description, result.Where, parseInt(result.Min_people), parseInt(result.Max_people));
                hostEvent.signAndSend(alice);
                console.log("Event registered");
                menu();
            });
        } else {
            menu();
        }
    });
}

//extrinsic.signAndSend(alice);


/*setInterval(() => {
    console.log(" --- MEET ---");
    api.query.templateModule.meetName().then((res) => {
        let val = res.unwrap();
        let msg = "";
        val.forEach(v => msg += String.fromCharCode(v));
        console.log("NAME: " + msg);
    });
    api.query.templateModule.meetDescription().then((res) => {
        let val = res.unwrap();
        let msg = "";
        val.forEach(v => msg += String.fromCharCode(v));
        console.log("DESCRIPTION: " + msg);
    });
    api.query.templateModule.meetWhere().then((res) => {
        let val = res.unwrap();
        let msg = "";
        val.forEach(v => msg += String.fromCharCode(v));
        console.log("WHERE: " + msg);
    });
    api.query.templateModule.meetMin().then((res) => {
        let val = res.unwrap();
        console.log("MIN: " + val.toString());
    });
    api.query.templateModule.meetMax().then((res) => {
        let val = res.unwrap();
        console.log("MAX: " + val.toString());
    });
    api.query.templateModule.meetInterested().then((res) => {
        let val = res.unwrap();
        console.log("INTERESTED: " + val.toString());
    });

    setTimeout(() => {extrinsic.signAndSend(alice);
    }, 8000);


}, 16000);

*/