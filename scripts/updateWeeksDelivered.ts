import { Customer } from "../src/bounded_contexts/operations/domain/customer/Customer";
import { mongooseCustomerRepository } from "../src/bounded_contexts/operations/infra/repositories/customer";
import { connectToDatabase } from "../src/infraestructure/mongoose/config/config";

export async function updateWeeksDelivered() {
    console.log("Starting script");
    await connectToDatabase();
    const customers: Customer[] = await mongooseCustomerRepository.findAll();
    const customersEmailMap: { [email: string]: Customer } = {};

    for (let customer of customers) {
        customersEmailMap[customer.email] = customer;
    }

    for (let customer of customersToUpdate.customers) {
        console.log("Processing customer: ", customer.email);
        const customerToUpdate = customersEmailMap[customer.email];
        if (!customerToUpdate) continue;
        const arrayOfDate = customer.first_order_date.split("/");
        arrayOfDate[0] = (parseInt(arrayOfDate[0]) - 1).toString();
        // const firstOrderDate = arrayOfDate.join("/");

        customerToUpdate.shopifyReceivedOrdersQuantity = parseInt(customer.weeks_delivered);
        customerToUpdate.firstOrderDate = new Date(parseInt(arrayOfDate[2]), parseInt(arrayOfDate[0]), parseInt(arrayOfDate[1]));
    }

    await mongooseCustomerRepository.updateMany(customers);
    console.log("Greacefully returning");
    return;
}

updateWeeksDelivered();

const customersToUpdate = {
    customers: [
        {
            email: "alejo@novolabs.xyz",
            weeks_delivered: "98",
            first_order_date: "10/29/19",
        },
        {
            email: "nicoescasany@gmail.com",
            weeks_delivered: "98",
            first_order_date: "10/29/19",
        },
        {
            email: "olga.kotkowska@gmail.com",
            weeks_delivered: "93",
            first_order_date: "5/3/19",
        },
        {
            email: "marianne@yellow-training.com",
            weeks_delivered: "58",
            first_order_date: "4/6/19",
        },
        {
            email: "araujomullernicolas@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/28/19",
        },
        {
            email: "willfleury@gmail.com",
            weeks_delivered: "113",
            first_order_date: "4/8/19",
        },
        {
            email: "mariaparra.rodriguez@gmail.com",
            weeks_delivered: "102",
            first_order_date: "4/8/19",
        },
        {
            email: "mdgiagnorio@gmail.com",
            weeks_delivered: "87",
            first_order_date: "7/7/19",
        },
        {
            email: "benjamin.loss@hotmail.com",
            weeks_delivered: "15",
            first_order_date: "4/26/19",
        },
        {
            email: "barbschael@gmail.com",
            weeks_delivered: "96",
            first_order_date: "5/3/19",
        },
        {
            email: "evelynhg1107@gmail.com",
            weeks_delivered: "8",
            first_order_date: "5/7/19",
        },
        {
            email: "sombra.ignacio@gmail.com",
            weeks_delivered: "60",
            first_order_date: "5/19/19",
        },
        {
            email: "sebastianhdzsa@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/30/19",
        },
        {
            email: "neolithicgorgon@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/30/19",
        },
        {
            email: "ekbuel@gmx.de",
            weeks_delivered: "53",
            first_order_date: "6/1/19",
        },
        {
            email: "garciavallevero@gmail.com",
            weeks_delivered: "28",
            first_order_date: "6/1/19",
        },
        {
            email: "mark@kirkov.dk",
            weeks_delivered: "70",
            first_order_date: "6/1/19",
        },
        {
            email: "mail@halfpapdesign.de",
            weeks_delivered: "53",
            first_order_date: "6/1/19",
        },
        {
            email: "Vmpierre@gmail.com",
            weeks_delivered: "66",
            first_order_date: "6/1/19",
        },
        {
            email: "antonkroisant@googlemail.com",
            weeks_delivered: "7",
            first_order_date: "6/1/19",
        },
        {
            email: "thebenseck@gmail.com",
            weeks_delivered: "12",
            first_order_date: "6/2/19",
        },
        {
            email: "alexa.kfoury@gmail.com",
            weeks_delivered: "3",
            first_order_date: "6/2/19",
        },
        {
            email: "rosario_signorello@icloud.com",
            weeks_delivered: "8",
            first_order_date: "6/2/19",
        },
        {
            email: "santiagocastiella@hotmail.com",
            weeks_delivered: "121",
            first_order_date: "6/4/19",
        },
        {
            email: "marcel@octaevo.com",
            weeks_delivered: "26",
            first_order_date: "6/26/19",
        },
        {
            email: "julia_sanchez_125@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "7/3/19",
        },
        {
            email: "estefy_g89@hotmail.com",
            weeks_delivered: "59",
            first_order_date: "7/5/19",
        },
        {
            email: "contactmarlacarpenter@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/6/19",
        },
        {
            email: "kwtaylor83@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/6/19",
        },
        {
            email: "Michiel.vanderHeide@gmail.com",
            weeks_delivered: "46",
            first_order_date: "7/6/19",
        },
        {
            email: "46carmona@gmail.com",
            weeks_delivered: "35",
            first_order_date: "7/7/19",
        },
        {
            email: "gorka_bon@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "7/7/19",
        },
        {
            email: "pro.arantxa.ordoyo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/7/19",
        },
        {
            email: "raquelvazquezcoronado@gmail.com",
            weeks_delivered: "17",
            first_order_date: "7/7/19",
        },
        {
            email: "javier.barberan.sanchez@gmail.com",
            weeks_delivered: "8",
            first_order_date: "7/7/19",
        },
        {
            email: "helenedjvh@gmail.com",
            weeks_delivered: "7",
            first_order_date: "7/7/19",
        },
        {
            email: "cjimenezvic@gmail.com",
            weeks_delivered: "8",
            first_order_date: "7/7/19",
        },
        {
            email: "sancar1983@gmail.com",
            weeks_delivered: "37",
            first_order_date: "7/7/19",
        },
        {
            email: "claudio.belcampo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/7/19",
        },
        {
            email: "ipandres90@gmail.com",
            weeks_delivered: "100",
            first_order_date: "7/7/19",
        },
        {
            email: "nueveseistres@gmail.com",
            weeks_delivered: "51",
            first_order_date: "7/12/19",
        },
        {
            email: "alejwp@gmail.com",
            weeks_delivered: "4",
            first_order_date: "7/17/19",
        },
        {
            email: "riko.nyberg@yahoo.com",
            weeks_delivered: "14",
            first_order_date: "8/13/19",
        },
        {
            email: "ppatel@exoftware.com",
            weeks_delivered: "9",
            first_order_date: "8/21/19",
        },
        {
            email: "uriel@urielsalis.me",
            weeks_delivered: "47",
            first_order_date: "8/25/19",
        },
        {
            email: "xmirasma@gmail.com",
            weeks_delivered: "6",
            first_order_date: "8/29/19",
        },
        {
            email: "benitzmc@gmail.com",
            weeks_delivered: "87",
            first_order_date: "8/31/19",
        },
        {
            email: "milda.joku@gmail.com",
            weeks_delivered: "36",
            first_order_date: "8/31/19",
        },
        {
            email: "xicombd@gmail.com",
            weeks_delivered: "7",
            first_order_date: "9/1/19",
        },
        {
            email: "donialove@gmail.com",
            weeks_delivered: "19",
            first_order_date: "9/1/19",
        },
        {
            email: "s4giordanino@yahoo.es",
            weeks_delivered: "45",
            first_order_date: "9/7/19",
        },
        {
            email: "iolanda.calvo@uab.cat",
            weeks_delivered: "7",
            first_order_date: "9/7/19",
        },
        {
            email: "cafpavan@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/7/19",
        },
        {
            email: "ecervera@audiocerver.com",
            weeks_delivered: "14",
            first_order_date: "9/7/19",
        },
        {
            email: "manudag@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/7/19",
        },
        {
            email: "vaikttor@hotmail.com",
            weeks_delivered: "40",
            first_order_date: "9/8/19",
        },
        {
            email: "mribaltahuelmo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/8/19",
        },
        {
            email: "harrisfellman@gmail.com",
            weeks_delivered: "27",
            first_order_date: "9/8/19",
        },
        {
            email: "maria.vangen.jordet@gmail.com",
            weeks_delivered: "30",
            first_order_date: "9/8/19",
        },
        {
            email: "r3dmund@gmail.com",
            weeks_delivered: "81",
            first_order_date: "9/8/19",
        },
        {
            email: "sardatorrandell@gmail.com",
            weeks_delivered: "7",
            first_order_date: "9/8/19",
        },
        {
            email: "gandalfsaxe@gmail.com",
            weeks_delivered: "86",
            first_order_date: "9/8/19",
        },
        {
            email: "mark_davidson5@hotmail.com",
            weeks_delivered: "34",
            first_order_date: "9/12/19",
        },
        {
            email: "amolina@tax.es",
            weeks_delivered: "5",
            first_order_date: "9/12/19",
        },
        {
            email: "hello@morenocollective.com",
            weeks_delivered: "11",
            first_order_date: "9/13/19",
        },
        {
            email: "rtapiavet@gmail.com",
            weeks_delivered: "93",
            first_order_date: "9/13/19",
        },
        {
            email: "attwood@live.co.uk",
            weeks_delivered: "53",
            first_order_date: "9/19/19",
        },
        {
            email: "ryan.romanes@gmail.com",
            weeks_delivered: "7",
            first_order_date: "9/20/19",
        },
        {
            email: "toma.aleknaviciute@gmail.com",
            weeks_delivered: "23",
            first_order_date: "9/23/19",
        },
        {
            email: "jordipadros1977@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/24/19",
        },
        {
            email: "leatonetti@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/25/19",
        },
        {
            email: "carinabjerge@hotmail.com",
            weeks_delivered: "35",
            first_order_date: "9/25/19",
        },
        {
            email: "csaxkjaer@gmail.com",
            weeks_delivered: "32",
            first_order_date: "9/26/19",
        },
        {
            email: "mayajudd@gmail.com",
            weeks_delivered: "71",
            first_order_date: "9/29/19",
        },
        {
            email: "isabella.toppenberg@gmail.com",
            weeks_delivered: "80",
            first_order_date: "9/29/19",
        },
        {
            email: "gouw.tim@gmail.com",
            weeks_delivered: "56",
            first_order_date: "9/29/19",
        },
        {
            email: "khooling44@outlook.com",
            weeks_delivered: "30",
            first_order_date: "9/29/19",
        },
        {
            email: "desiree.falter@gmail.com",
            weeks_delivered: "86",
            first_order_date: "10/4/19",
        },
        {
            email: "carole.lionet@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/5/19",
        },
        {
            email: "gsegarra@protonmail.com",
            weeks_delivered: "1",
            first_order_date: "10/5/19",
        },
        {
            email: "replaycos@gmail.com",
            weeks_delivered: "11",
            first_order_date: "10/5/19",
        },
        {
            email: "sebastienloisy@gmail.com",
            weeks_delivered: "80",
            first_order_date: "10/5/19",
        },
        {
            email: "lacg456@gmail.com",
            weeks_delivered: "37",
            first_order_date: "10/5/19",
        },
        {
            email: "nonnacasas@gmail.com",
            weeks_delivered: "66",
            first_order_date: "10/6/19",
        },
        {
            email: "elviraln@hotmail.com",
            weeks_delivered: "18",
            first_order_date: "10/6/19",
        },
        {
            email: "sol.y.jacques@gmail.com",
            weeks_delivered: "70",
            first_order_date: "10/6/19",
        },
        {
            email: "flodelepinay@gmail.com",
            weeks_delivered: "55",
            first_order_date: "10/6/19",
        },
        {
            email: "gustavobrugiafreddo@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "10/6/19",
        },
        {
            email: "michelle.spencer.72@gmail.com",
            weeks_delivered: "101",
            first_order_date: "10/6/19",
        },
        {
            email: "leila_scheffers@hotmail.com",
            weeks_delivered: "17",
            first_order_date: "10/9/19",
        },
        {
            email: "nadin1977@yahoo.de",
            weeks_delivered: "4",
            first_order_date: "10/12/19",
        },
        {
            email: "magali.dejaegher@gmail.com",
            weeks_delivered: "13",
            first_order_date: "10/17/19",
        },
        {
            email: "irismagrorojo@gmail.com",
            weeks_delivered: "25",
            first_order_date: "10/19/19",
        },
        {
            email: "jorgearaujom@gmail.com",
            weeks_delivered: "5",
            first_order_date: "10/20/19",
        },
        {
            email: "katie_rich@hotmail.com",
            weeks_delivered: "34",
            first_order_date: "10/24/19",
        },
        {
            email: "picksy92@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "10/29/19",
        },
        {
            email: "mc2840@yahoo.dk",
            weeks_delivered: "1",
            first_order_date: "10/30/19",
        },
        {
            email: "mandermandeep@hotmail.com",
            weeks_delivered: "96",
            first_order_date: "10/31/19",
        },
        {
            email: "angieporcel@gmail.com",
            weeks_delivered: "16",
            first_order_date: "10/31/19",
        },
        {
            email: "adamzemmoura@gmail.com",
            weeks_delivered: "39",
            first_order_date: "11/1/19",
        },
        {
            email: "lina@agentedigital.com",
            weeks_delivered: "31",
            first_order_date: "11/2/19",
        },
        {
            email: "michelleruz@yahoo.com",
            weeks_delivered: "1",
            first_order_date: "11/2/19",
        },
        {
            email: "linashopping5@gmail.com",
            weeks_delivered: "62",
            first_order_date: "11/2/19",
        },
        {
            email: "lina.jure@icloud.com",
            weeks_delivered: "1",
            first_order_date: "11/2/19",
        },
        {
            email: "shannonnakache@me.com",
            weeks_delivered: "2",
            first_order_date: "11/3/19",
        },
        {
            email: "kleber20@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/3/19",
        },
        {
            email: "aagje.peleman@gmail.com",
            weeks_delivered: "29",
            first_order_date: "11/3/19",
        },
        {
            email: "anna.indira.m@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/3/19",
        },
        {
            email: "mauri.benavente@gmail.com",
            weeks_delivered: "12",
            first_order_date: "11/4/19",
        },
        {
            email: "camilo.luna85@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/4/19",
        },
        {
            email: "mariannenore@hotmail.com",
            weeks_delivered: "19",
            first_order_date: "1/22/21",
        },
        {
            email: "tathyotero@gmail.com",
            weeks_delivered: "45",
            first_order_date: "11/6/19",
        },
        {
            email: "ignacio.velazquez@icloud.com",
            weeks_delivered: "27",
            first_order_date: "11/10/19",
        },
        {
            email: "eliacasasfz@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/13/19",
        },
        {
            email: "ANTERIOR - s.j.vestit@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/17/19",
        },
        {
            email: "xuriyet@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/17/19",
        },
        {
            email: "senorita.timms@gmail.com",
            weeks_delivered: "35",
            first_order_date: "11/17/19",
        },
        {
            email: "machez@hotmail.com",
            weeks_delivered: "44",
            first_order_date: "11/17/19",
        },
        {
            email: "lilybluestocking@gmail.com",
            weeks_delivered: "33",
            first_order_date: "11/17/19",
        },
        {
            email: "aurelie_et_laurent@yahoo.com",
            weeks_delivered: "66",
            first_order_date: "11/17/19",
        },
        {
            email: "5971888@mail.ru",
            weeks_delivered: "11",
            first_order_date: "11/18/19",
        },
        {
            email: "bkleinelastra@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/21/19",
        },
        {
            email: "kirsty@trychameleon.com",
            weeks_delivered: "4",
            first_order_date: "11/21/19",
        },
        {
            email: "milsydavis@gmail.com",
            weeks_delivered: "40",
            first_order_date: "11/22/19",
        },
        {
            email: "louisehvam@hotmail.com",
            weeks_delivered: "28",
            first_order_date: "11/22/19",
        },
        {
            email: "mvearp@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/24/19",
        },
        {
            email: "luciezakova@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/28/19",
        },
        {
            email: "t.bloomfield9@gmail.com",
            weeks_delivered: "61",
            first_order_date: "11/28/19",
        },
        {
            email: "clobato@eada.edu",
            weeks_delivered: "46",
            first_order_date: "12/1/19",
        },
        {
            email: "martinuria@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "11/30/19",
        },
        {
            email: "surfychick777@yahoo.com.au",
            weeks_delivered: "11",
            first_order_date: "12/3/19",
        },
        {
            email: "alicebocchi@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/7/19",
        },
        {
            email: "saraluna28@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/7/19",
        },
        {
            email: "igorbregana@gmail.com",
            weeks_delivered: "78",
            first_order_date: "12/7/19",
        },
        {
            email: "homesbytammy@sbcglobal.net",
            weeks_delivered: "2",
            first_order_date: "12/8/19",
        },
        {
            email: "jhesus34@yahoo.es",
            weeks_delivered: "1",
            first_order_date: "12/8/19",
        },
        {
            email: "eleroder@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/8/19",
        },
        {
            email: "alessiotmr@yahoo.it",
            weeks_delivered: "1",
            first_order_date: "12/8/19",
        },
        {
            email: "mateo.guadalfajara@gmail.com",
            weeks_delivered: "18",
            first_order_date: "12/8/19",
        },
        {
            email: "rougehuma@gmail.com",
            weeks_delivered: "3",
            first_order_date: "12/8/19",
        },
        {
            email: "gustav@letscooknow.es",
            weeks_delivered: "92",
            first_order_date: "12/8/19",
        },
        {
            email: "amyaharris@gmail.com",
            weeks_delivered: "7",
            first_order_date: "12/14/19",
        },
        {
            email: "joy_guidi@yahoo.com",
            weeks_delivered: "11",
            first_order_date: "12/14/19",
        },
        {
            email: "tguzmanm@hotmail.com",
            weeks_delivered: "10",
            first_order_date: "12/14/19",
        },
        {
            email: "hernandez.paula.182@gmail.com",
            weeks_delivered: "86",
            first_order_date: "12/14/19",
        },
        {
            email: "estefanygomezcortes@gmail.com",
            weeks_delivered: "6",
            first_order_date: "12/16/19",
        },
        {
            email: "fxrescbe@gmail.com",
            weeks_delivered: "64",
            first_order_date: "12/17/19",
        },
        {
            email: "james.regal@hotmail.com",
            weeks_delivered: "42",
            first_order_date: "12/29/19",
        },
        {
            email: "cjtayl89@gmail.com",
            weeks_delivered: "21",
            first_order_date: "12/30/19",
        },
        {
            email: "miquelcristobal@gmail.com",
            weeks_delivered: "4",
            first_order_date: "1/4/20",
        },
        {
            email: "Jane.mitchell2412@gmail.com",
            weeks_delivered: "67",
            first_order_date: "1/5/20",
        },
        {
            email: "nathalysepulveda@hotmail.com",
            weeks_delivered: "70",
            first_order_date: "1/6/20",
        },
        {
            email: "xenia@nomadsevents.com",
            weeks_delivered: "6",
            first_order_date: "1/8/20",
        },
        {
            email: "imendes95@msn.com",
            weeks_delivered: "26",
            first_order_date: "1/11/20",
        },
        {
            email: "meaganbellovin@gmail.com",
            weeks_delivered: "18",
            first_order_date: "1/16/20",
        },
        {
            email: "vgarzon@bodas.net",
            weeks_delivered: "2",
            first_order_date: "1/17/20",
        },
        {
            email: "andrewcarle@gmail.com",
            weeks_delivered: "28",
            first_order_date: "1/18/20",
        },
        {
            email: "bansoodeb@gmail.com",
            weeks_delivered: "21",
            first_order_date: "1/23/20",
        },
        {
            email: "tammyb@ecrayons.com",
            weeks_delivered: "66",
            first_order_date: "1/24/20",
        },
        {
            email: "karenswift@sky.com",
            weeks_delivered: "47",
            first_order_date: "1/24/20",
        },
        {
            email: "xavier.noriega.serra@gmail.com",
            weeks_delivered: "5",
            first_order_date: "1/29/20",
        },
        {
            email: "john@the-millers.eu",
            weeks_delivered: "6",
            first_order_date: "1/29/20",
        },
        {
            email: "karen05@me.com",
            weeks_delivered: "56",
            first_order_date: "1/31/20",
        },
        {
            email: "angelaescola92@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/1/20",
        },
        {
            email: "angeles-serrano@hotmail.com",
            weeks_delivered: "50",
            first_order_date: "2/1/20",
        },
        {
            email: "neyled@hotmail.com",
            weeks_delivered: "37",
            first_order_date: "2/1/20",
        },
        {
            email: "jorge.claramunt@seat.es",
            weeks_delivered: "6",
            first_order_date: "2/1/20",
        },
        {
            email: "markwatson97@live.co.uk",
            weeks_delivered: "5",
            first_order_date: "2/1/20",
        },
        {
            email: "aaaline@hotmail.com",
            weeks_delivered: "92",
            first_order_date: "2/1/20",
        },
        {
            email: "samaire.josep@gmail.com",
            weeks_delivered: "51",
            first_order_date: "2/1/20",
        },
        {
            email: "rectoreta@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "2/2/20",
        },
        {
            email: "wtg007@bucknell.edu",
            weeks_delivered: "6",
            first_order_date: "2/3/20",
        },
        {
            email: "esthelaford15@yahoo.com",
            weeks_delivered: "46",
            first_order_date: "2/5/20",
        },
        {
            email: "farah@rahulkapoor.com",
            weeks_delivered: "4",
            first_order_date: "2/7/20",
        },
        {
            email: "heather.delehant@gmail.com",
            weeks_delivered: "4",
            first_order_date: "2/7/20",
        },
        {
            email: "eduard.blanch.urban@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/11/20",
        },
        {
            email: "berrywrobel@gmail.com",
            weeks_delivered: "19",
            first_order_date: "2/11/20",
        },
        {
            email: "daustin121@yahoo.com",
            weeks_delivered: "87",
            first_order_date: "2/13/20",
        },
        {
            email: "jac070@bucknell.edu",
            weeks_delivered: "3",
            first_order_date: "2/19/20",
        },
        {
            email: "pelagiedefoort@yahoo.fr",
            weeks_delivered: "76",
            first_order_date: "2/20/20",
        },
        {
            email: "rafael@ecoetica.es",
            weeks_delivered: "8",
            first_order_date: "2/20/20",
        },
        {
            email: "mariano.ure@gmail.com",
            weeks_delivered: "68",
            first_order_date: "2/20/20",
        },
        {
            email: "majacquinot@gmail.com",
            weeks_delivered: "48",
            first_order_date: "2/26/20",
        },
        {
            email: "carly@type-coach.com",
            weeks_delivered: "2",
            first_order_date: "2/27/20",
        },
        {
            email: "cena.johanna@gmail.com",
            weeks_delivered: "59",
            first_order_date: "2/27/20",
        },
        {
            email: "nichole_ozdemir@yahoo.com",
            weeks_delivered: "13",
            first_order_date: "2/27/20",
        },
        {
            email: "cesaralaboy@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/27/20",
        },
        {
            email: "anguita.lauraisa@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/27/20",
        },
        {
            email: "matiase.rubio@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/27/20",
        },
        {
            email: "yvalle5@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "2/27/20",
        },
        {
            email: "tanida.tim@googlemail.com",
            weeks_delivered: "9",
            first_order_date: "2/27/20",
        },
        {
            email: "julien.eychenne@hotmail.fr",
            weeks_delivered: "2",
            first_order_date: "2/27/20",
        },
        {
            email: "lu.rossetti@hotmail.it",
            weeks_delivered: "1",
            first_order_date: "2/27/20",
        },
        {
            email: "sofia16@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/29/20",
        },
        {
            email: "ned@tectonica.co",
            weeks_delivered: "29",
            first_order_date: "3/1/20",
        },
        {
            email: "emma.sewart@outlook.com",
            weeks_delivered: "49",
            first_order_date: "3/1/20",
        },
        {
            email: "mmobry@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "3/2/20",
        },
        {
            email: "cristinaandrushko@gmail.com",
            weeks_delivered: "13",
            first_order_date: "3/2/20",
        },
        {
            email: "tobias.hoffmann@crg.eu",
            weeks_delivered: "64",
            first_order_date: "3/2/20",
        },
        {
            email: "meganeileen.mcd@gmail.com",
            weeks_delivered: "54",
            first_order_date: "3/3/20",
        },
        {
            email: "challuedde@gmail.com",
            weeks_delivered: "77",
            first_order_date: "3/3/20",
        },
        {
            email: "acarollo@asbarcelona.com",
            weeks_delivered: "23",
            first_order_date: "3/4/20",
        },
        {
            email: "marjolein.bloemhof@gmail.com",
            weeks_delivered: "52",
            first_order_date: "3/5/20",
        },
        {
            email: "jenniferkillion.1@gmail.com",
            weeks_delivered: "78",
            first_order_date: "3/6/20",
        },
        {
            email: "kim.marina.ed@gmail.com",
            weeks_delivered: "29",
            first_order_date: "3/7/20",
        },
        {
            email: "leenderslente@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "3/9/20",
        },
        {
            email: "soniajuanvitaller@hotmail.com",
            weeks_delivered: "23",
            first_order_date: "3/9/20",
        },
        {
            email: "genutf@yahoo.es",
            weeks_delivered: "48",
            first_order_date: "3/9/20",
        },
        {
            email: "katsx@hotmail.com",
            weeks_delivered: "19",
            first_order_date: "3/9/20",
        },
        {
            email: "britta@bitxos.info",
            weeks_delivered: "1",
            first_order_date: "3/13/20",
        },
        {
            email: "misswahlen@hotmail.com",
            weeks_delivered: "17",
            first_order_date: "3/20/20",
        },
        {
            email: "alba.guardiola@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/20/20",
        },
        {
            email: "yavanna.valencia@edu.vlerick.com",
            weeks_delivered: "10",
            first_order_date: "3/20/20",
        },
        {
            email: "spencer.evoy@gmail.com",
            weeks_delivered: "72",
            first_order_date: "3/21/20",
        },
        {
            email: "fastconn72@gmail.com",
            weeks_delivered: "3",
            first_order_date: "3/24/20",
        },
        {
            email: "pamela.mckillop@gmail.com",
            weeks_delivered: "8",
            first_order_date: "3/25/20",
        },
        {
            email: "dunk.gail@gmail.com",
            weeks_delivered: "7",
            first_order_date: "3/27/20",
        },
        {
            email: "megconnolly3@gmail.com",
            weeks_delivered: "58",
            first_order_date: "3/28/20",
        },
        {
            email: "sagoher@gmail.com",
            weeks_delivered: "53",
            first_order_date: "3/28/20",
        },
        {
            email: "abonifacie@gmail.com",
            weeks_delivered: "14",
            first_order_date: "3/28/20",
        },
        {
            email: "enniodybeli@gmail.com",
            weeks_delivered: "7",
            first_order_date: "3/28/20",
        },
        {
            email: "mol.sven@gmail.com",
            weeks_delivered: "58",
            first_order_date: "3/30/20",
        },
        {
            email: "griffm@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/1/20",
        },
        {
            email: "ffox@asbarcelona.com",
            weeks_delivered: "25",
            first_order_date: "4/2/20",
        },
        {
            email: "katiemurphy@live.co.uk",
            weeks_delivered: "70",
            first_order_date: "4/3/20",
        },
        {
            email: "fmurgades@gmail.com",
            weeks_delivered: "12",
            first_order_date: "4/7/20",
        },
        {
            email: "alykorepanova@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/6/20",
        },
        {
            email: "swimr1013@yahoo.com",
            weeks_delivered: "29",
            first_order_date: "4/7/20",
        },
        {
            email: "rplaszowski@gmail.com",
            weeks_delivered: "15",
            first_order_date: "4/8/20",
        },
        {
            email: "dinosahrus@aol.com",
            weeks_delivered: "19",
            first_order_date: "4/9/20",
        },
        {
            email: "chris_hunt@hotmail.com",
            weeks_delivered: "10",
            first_order_date: "4/10/20",
        },
        {
            email: "sandra.rams@iese.net",
            weeks_delivered: "1",
            first_order_date: "4/13/20",
        },
        {
            email: "vmastwijk@gmail.com",
            weeks_delivered: "10",
            first_order_date: "4/13/20",
        },
        {
            email: "sophienavarro85@gmail.com",
            weeks_delivered: "12",
            first_order_date: "4/14/20",
        },
        {
            email: "nfbatlle@gmail.com",
            weeks_delivered: "3",
            first_order_date: "4/15/20",
        },
        {
            email: "strelnikova.yulia@gmail.com",
            weeks_delivered: "27",
            first_order_date: "4/17/20",
        },
        {
            email: "juanpe_ro@hotmail.com",
            weeks_delivered: "14",
            first_order_date: "4/21/20",
        },
        {
            email: "kresta@hotmail.com",
            weeks_delivered: "10",
            first_order_date: "4/22/20",
        },
        {
            email: "irinalya@gmail.com",
            weeks_delivered: "58",
            first_order_date: "4/22/20",
        },
        {
            email: "melissamiller79@yahoo.com",
            weeks_delivered: "47",
            first_order_date: "4/22/20",
        },
        {
            email: "wmejiav00@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "4/22/20",
        },
        {
            email: "birgitte.bohnsen@iese.net",
            weeks_delivered: "45",
            first_order_date: "4/23/20",
        },
        {
            email: "agibarkoczi@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/23/20",
        },
        {
            email: "thekirbyhome@btinternet.com",
            weeks_delivered: "8",
            first_order_date: "4/24/20",
        },
        {
            email: "viktordavidsson77@gmail.com",
            weeks_delivered: "9",
            first_order_date: "4/26/20",
        },
        {
            email: "cochez.sophie@hotmail.fr",
            weeks_delivered: "1",
            first_order_date: "4/28/20",
        },
        {
            email: "pederson@live.ca",
            weeks_delivered: "1",
            first_order_date: "4/28/20",
        },
        {
            email: "bizpspriya@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/29/20",
        },
        {
            email: "odile.wust@gmail.com",
            weeks_delivered: "42",
            first_order_date: "4/29/20",
        },
        {
            email: "bmenchon@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/1/20",
        },
        {
            email: "rigazio.emma@orange.fr",
            weeks_delivered: "59",
            first_order_date: "5/2/20",
        },
        {
            email: "cindyjansen@gmx.de",
            weeks_delivered: "9",
            first_order_date: "5/3/20",
        },
        {
            email: "daniela.losada@gmail.com",
            weeks_delivered: "40",
            first_order_date: "5/4/20",
        },
        {
            email: "isabeloliva26@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "5/5/20",
        },
        {
            email: "ymbern@gmail.com",
            weeks_delivered: "52",
            first_order_date: "5/6/20",
        },
        {
            email: "soyjesus91@icloud.com",
            weeks_delivered: "13",
            first_order_date: "5/6/20",
        },
        {
            email: "dianamendez85@gmail.com",
            weeks_delivered: "2",
            first_order_date: "5/7/20",
        },
        {
            email: "ccrescenti@asbarcelona.com",
            weeks_delivered: "71",
            first_order_date: "5/10/20",
        },
        {
            email: "Barthodk@gmail.com",
            weeks_delivered: "45",
            first_order_date: "5/10/20",
        },
        {
            email: "colas.raynal@gmail.com",
            weeks_delivered: "56",
            first_order_date: "5/11/20",
        },
        {
            email: "taniagrifols@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "5/12/20",
        },
        {
            email: "jrodriguezayos@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/13/20",
        },
        {
            email: "ebolanos615@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "5/13/20",
        },
        {
            email: "catschuitemaker@hotmail.com",
            weeks_delivered: "35",
            first_order_date: "5/14/20",
        },
        {
            email: "amalvarezgomez@gmail.com",
            weeks_delivered: "71",
            first_order_date: "5/14/20",
        },
        {
            email: "james.r.taylor@live.com.au",
            weeks_delivered: "46",
            first_order_date: "5/15/20",
        },
        {
            email: "hadda.hreidarsdottir@gmail.com",
            weeks_delivered: "2",
            first_order_date: "5/18/20",
        },
        {
            email: "bcnerin@msn.com",
            weeks_delivered: "18",
            first_order_date: "5/18/20",
        },
        {
            email: "awen99@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/18/20",
        },
        {
            email: "stradiottol10@gmail.com",
            weeks_delivered: "24",
            first_order_date: "5/19/20",
        },
        {
            email: "rene.rauch@outlook.de",
            weeks_delivered: "3",
            first_order_date: "5/19/20",
        },
        {
            email: "hangovershotes@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/20/20",
        },
        {
            email: "matt.philpott@autodesk.com",
            weeks_delivered: "2",
            first_order_date: "5/21/20",
        },
        {
            email: "carolinearora@hotmail.com",
            weeks_delivered: "5",
            first_order_date: "5/21/20",
        },
        {
            email: "davidao1982@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "5/22/20",
        },
        {
            email: "martabaneress@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/23/20",
        },
        {
            email: "lilisha.burris@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/23/20",
        },
        {
            email: "michaela.o.foster@gmail.com",
            weeks_delivered: "53",
            first_order_date: "5/23/20",
        },
        {
            email: "mazin.elnohi@icloud.com",
            weeks_delivered: "1",
            first_order_date: "5/24/20",
        },
        {
            email: "bjorn@vmsweden.com",
            weeks_delivered: "17",
            first_order_date: "5/24/20",
        },
        {
            email: "anarossettic@gmail.com",
            weeks_delivered: "3",
            first_order_date: "5/25/20",
        },
        {
            email: "rbggoce@gmail.com",
            weeks_delivered: "39",
            first_order_date: "5/30/20",
        },
        {
            email: "sanghaes@gmail.com",
            weeks_delivered: "2",
            first_order_date: "6/3/20",
        },
        {
            email: "ale_2flores@hotmail.com",
            weeks_delivered: "20",
            first_order_date: "6/10/20",
        },
        {
            email: "anarrebelo92@gmail.com",
            weeks_delivered: "31",
            first_order_date: "6/8/20",
        },
        {
            email: "lia.morse@gmail.com",
            weeks_delivered: "4",
            first_order_date: "6/15/20",
        },
        {
            email: "joaquinvf@gmail.com",
            weeks_delivered: "4",
            first_order_date: "6/16/20",
        },
        {
            email: "SILGALVI@GMAIL.COM",
            weeks_delivered: "2",
            first_order_date: "6/18/20",
        },
        {
            email: "magaly.viveros@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/18/20",
        },
        {
            email: "jacquelinebakels@gmail.com",
            weeks_delivered: "14",
            first_order_date: "6/21/20",
        },
        {
            email: "sevimcaliskansc@gmail.com",
            weeks_delivered: "18",
            first_order_date: "6/23/20",
        },
        {
            email: "catalinagrs813@gmail.com",
            weeks_delivered: "8",
            first_order_date: "6/23/20",
        },
        {
            email: "jonat.pires89@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/24/20",
        },
        {
            email: "leigh.e.o@gmail.com",
            weeks_delivered: "4",
            first_order_date: "6/25/20",
        },
        {
            email: "polly@hey.com",
            weeks_delivered: "3",
            first_order_date: "6/28/20",
        },
        {
            email: "ysabellamerced@gmail.com",
            weeks_delivered: "10",
            first_order_date: "6/29/20",
        },
        {
            email: "wilsonvictoria36@googlemail.com",
            weeks_delivered: "12",
            first_order_date: "7/1/20",
        },
        {
            email: "kduym@yahoo.com",
            weeks_delivered: "13",
            first_order_date: "7/1/20",
        },
        {
            email: "katrinagufler@gmail.com",
            weeks_delivered: "47",
            first_order_date: "7/3/20",
        },
        {
            email: "miriam_riera@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "7/3/20",
        },
        {
            email: "vasart@gmail.com",
            weeks_delivered: "13",
            first_order_date: "7/5/20",
        },
        {
            email: "claudia.treacy@Yahoo.com",
            weeks_delivered: "2",
            first_order_date: "7/7/20",
        },
        {
            email: "ambar.mhc@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/12/20",
        },
        {
            email: "nitabaptistac@gmail.com",
            weeks_delivered: "27",
            first_order_date: "7/13/20",
        },
        {
            email: "tanyaknight4@gmail.com",
            weeks_delivered: "33",
            first_order_date: "7/13/20",
        },
        {
            email: "ing.emiliolabal@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/16/20",
        },
        {
            email: "ldavidson@asbarcelona.com",
            weeks_delivered: "63",
            first_order_date: "7/17/20",
        },
        {
            email: "bikibarcelona@gmail.com",
            weeks_delivered: "7",
            first_order_date: "7/17/20",
        },
        {
            email: "mklages93@gmail.com",
            weeks_delivered: "22",
            first_order_date: "7/18/20",
        },
        {
            email: "nina.giannetto@gmail.com",
            weeks_delivered: "11",
            first_order_date: "7/19/20",
        },
        {
            email: "rachaelbrand@msn.com",
            weeks_delivered: "1",
            first_order_date: "7/22/20",
        },
        {
            email: "kim-vandekerckhove@hotmail.com",
            weeks_delivered: "26",
            first_order_date: "7/22/20",
        },
        {
            email: "Barbie-337@hotmail.com",
            weeks_delivered: "41",
            first_order_date: "7/23/20",
        },
        {
            email: "tiggr@gmx.li",
            weeks_delivered: "4",
            first_order_date: "7/23/20",
        },
        {
            email: "alexander.ayres1@gmail.com",
            weeks_delivered: "19",
            first_order_date: "7/25/20",
        },
        {
            email: "mguzmanvanreijn@gmail.com",
            weeks_delivered: "3",
            first_order_date: "7/26/20",
        },
        {
            email: "gabriel.maeztu@gmail.com",
            weeks_delivered: "7",
            first_order_date: "7/29/20",
        },
        {
            email: "bellaalyssalee@gmail.com",
            weeks_delivered: "18",
            first_order_date: "7/31/20",
        },
        {
            email: "harelj6@gmail.com",
            weeks_delivered: "2",
            first_order_date: "8/1/20",
        },
        {
            email: "florian-werner@web.de",
            weeks_delivered: "3",
            first_order_date: "8/6/20",
        },
        {
            email: "maiconscosta@gmail.com",
            weeks_delivered: "32",
            first_order_date: "8/9/20",
        },
        {
            email: "caritoru_08@hotmail.com",
            weeks_delivered: "35",
            first_order_date: "8/13/20",
        },
        {
            email: "arthur_gsai@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "8/14/20",
        },
        {
            email: "lisaknelange@gmail.com",
            weeks_delivered: "15",
            first_order_date: "8/15/20",
        },
        {
            email: "lara.yousuf83@gmail.com",
            weeks_delivered: "2",
            first_order_date: "8/15/20",
        },
        {
            email: "holowarez@gmail.com",
            weeks_delivered: "27",
            first_order_date: "8/16/20",
        },
        {
            email: "ashleyjean23@gmail.com",
            weeks_delivered: "27",
            first_order_date: "8/18/20",
        },
        {
            email: "vileom@me.com",
            weeks_delivered: "9",
            first_order_date: "8/22/20",
        },
        {
            email: "h_l_smith@yahoo.com",
            weeks_delivered: "8",
            first_order_date: "8/25/20",
        },
        {
            email: "daniela.diazgranados@gmail.com",
            weeks_delivered: "15",
            first_order_date: "8/26/20",
        },
        {
            email: "pepsyporer@yahoo.com",
            weeks_delivered: "3",
            first_order_date: "8/27/20",
        },
        {
            email: "nataliabelenguer@gmail.com",
            weeks_delivered: "9",
            first_order_date: "8/27/20",
        },
        {
            email: "tejarau19@gmail.com",
            weeks_delivered: "31",
            first_order_date: "8/28/20",
        },
        {
            email: "voina.ovidiu@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/30/20",
        },
        {
            email: "lysianendjock@gmail.com",
            weeks_delivered: "35",
            first_order_date: "8/30/20",
        },
        {
            email: "aled@aleddavies.com",
            weeks_delivered: "26",
            first_order_date: "9/1/20",
        },
        {
            email: "Elise.medica@gmail.com",
            weeks_delivered: "55",
            first_order_date: "9/1/20",
        },
        {
            email: "t.schneider.1987@outlook.de",
            weeks_delivered: "6",
            first_order_date: "9/2/20",
        },
        {
            email: "marlottezandwijk@hotmail.com",
            weeks_delivered: "49",
            first_order_date: "9/3/20",
        },
        {
            email: "tomvk@gmx.de",
            weeks_delivered: "1",
            first_order_date: "9/3/20",
        },
        {
            email: "infoprezii@gmail.com",
            weeks_delivered: "43",
            first_order_date: "9/3/20",
        },
        {
            email: "olearteversatil@gmail.com",
            weeks_delivered: "21",
            first_order_date: "9/4/20",
        },
        {
            email: "ceciliabarudi@tutanota.com",
            weeks_delivered: "53",
            first_order_date: "9/4/20",
        },
        {
            email: "bestellungen@mattig.es",
            weeks_delivered: "48",
            first_order_date: "9/4/20",
        },
        {
            email: "kharvkh49@gmail.com",
            weeks_delivered: "32",
            first_order_date: "9/5/20",
        },
        {
            email: "lindsayrichardsforrest@gmail.com",
            weeks_delivered: "49",
            first_order_date: "9/6/20",
        },
        {
            email: "thicomm@gmail.com",
            weeks_delivered: "6",
            first_order_date: "9/6/20",
        },
        {
            email: "mvschneiderg@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/6/20",
        },
        {
            email: "zorakovacic@gmail.com",
            weeks_delivered: "24",
            first_order_date: "9/6/20",
        },
        {
            email: "vtallie@gmail.com",
            weeks_delivered: "25",
            first_order_date: "9/6/20",
        },
        {
            email: "apullen12@gmail.com",
            weeks_delivered: "54",
            first_order_date: "9/7/20",
        },
        {
            email: "jenny.furrer@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "9/8/20",
        },
        {
            email: "katjalegien@gmx.de",
            weeks_delivered: "50",
            first_order_date: "9/9/20",
        },
        {
            email: "alenboro@yahoo.co.uk",
            weeks_delivered: "1",
            first_order_date: "9/9/20",
        },
        {
            email: "da_kunz@yahoo.de",
            weeks_delivered: "56",
            first_order_date: "9/9/20",
        },
        {
            email: "joan.caba@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/9/20",
        },
        {
            email: "cmxdaily@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/14/20",
        },
        {
            email: "mpleighty@gmail.com",
            weeks_delivered: "34",
            first_order_date: "9/14/20",
        },
        {
            email: "mcgovern.t.r@gmail.com",
            weeks_delivered: "36",
            first_order_date: "9/14/20",
        },
        {
            email: "matte_isabelle@yahoo.fr",
            weeks_delivered: "60",
            first_order_date: "9/15/20",
        },
        {
            email: "mebond511@gmail.com",
            weeks_delivered: "5",
            first_order_date: "9/16/20",
        },
        {
            email: "alizgr@gmail.com",
            weeks_delivered: "30",
            first_order_date: "9/17/20",
        },
        {
            email: "pachu@global.t-bird.edu",
            weeks_delivered: "33",
            first_order_date: "9/17/20",
        },
        {
            email: "inmamolina90@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/17/20",
        },
        {
            email: "yonumonu@gmail.com",
            weeks_delivered: "35",
            first_order_date: "5/16/21",
        },
        {
            email: "ssoydan@gmail.com",
            weeks_delivered: "50",
            first_order_date: "9/17/20",
        },
        {
            email: "migyulli@hotmail.com",
            weeks_delivered: "11",
            first_order_date: "9/18/20",
        },
        {
            email: "suuss1990@hotmail.com",
            weeks_delivered: "32",
            first_order_date: "9/18/20",
        },
        {
            email: "maxime.gs@gmx.com",
            weeks_delivered: "49",
            first_order_date: "9/18/20",
        },
        {
            email: "dominomi79@gmail.com",
            weeks_delivered: "39",
            first_order_date: "9/19/20",
        },
        {
            email: "mariahelada@yahoo.es",
            weeks_delivered: "1",
            first_order_date: "9/20/20",
        },
        {
            email: "pau.vergin@googlemail.com",
            weeks_delivered: "13",
            first_order_date: "9/21/20",
        },
        {
            email: "ninaduysan@yahoo.fr",
            weeks_delivered: "1",
            first_order_date: "9/23/20",
        },
        {
            email: "aly.a.bauer@gmail.com",
            weeks_delivered: "45",
            first_order_date: "9/23/20",
        },
        {
            email: "pim.fakkeldij@sap.com",
            weeks_delivered: "2",
            first_order_date: "9/25/20",
        },
        {
            email: "matiasmoraiz@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/25/20",
        },
        {
            email: "Andi.onhaus@gmail.com",
            weeks_delivered: "38",
            first_order_date: "9/27/20",
        },
        {
            email: "lauryn16smith@gmail.com",
            weeks_delivered: "12",
            first_order_date: "9/27/20",
        },
        {
            email: "kelseydsheehan@gmail.com",
            weeks_delivered: "35",
            first_order_date: "9/27/20",
        },
        {
            email: "irinabogorad@gmail.com",
            weeks_delivered: "13",
            first_order_date: "9/29/20",
        },
        {
            email: "ashleighlapointe@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "9/29/20",
        },
        {
            email: "nadegebourdin@outlook.com",
            weeks_delivered: "15",
            first_order_date: "9/30/20",
        },
        {
            email: "edgar.fando@gmail.com",
            weeks_delivered: "35",
            first_order_date: "10/1/20",
        },
        {
            email: "ambar.herediah@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/1/20",
        },
        {
            email: "thiel_melanie@gmx.de",
            weeks_delivered: "25",
            first_order_date: "10/2/20",
        },
        {
            email: "ssvetlana818@gmail.com",
            weeks_delivered: "6",
            first_order_date: "10/2/20",
        },
        {
            email: "danielaeiberle@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/2/20",
        },
        {
            email: "justeenyc@gmail.com",
            weeks_delivered: "19",
            first_order_date: "10/2/20",
        },
        {
            email: "munshi.nabeelah@gmail.com",
            weeks_delivered: "13",
            first_order_date: "10/2/20",
        },
        {
            email: "lvermeulen@me.com",
            weeks_delivered: "5",
            first_order_date: "10/3/20",
        },
        {
            email: "kleijntje@gmail.com",
            weeks_delivered: "11",
            first_order_date: "10/3/20",
        },
        {
            email: "marian.ht@hotmail.com",
            weeks_delivered: "5",
            first_order_date: "10/4/20",
        },
        {
            email: "siiri.lietu@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/6/20",
        },
        {
            email: "skozinskaweb@gmail.com",
            weeks_delivered: "27",
            first_order_date: "10/7/20",
        },
        {
            email: "awilliams.trading@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/7/20",
        },
        {
            email: "gsamuel85@gmail.com",
            weeks_delivered: "44",
            first_order_date: "10/8/20",
        },
        {
            email: "noshutdown@gmail.com",
            weeks_delivered: "39",
            first_order_date: "10/8/20",
        },
        {
            email: "kelly@helivac.co.za",
            weeks_delivered: "38",
            first_order_date: "10/8/20",
        },
        {
            email: "Helena-94@hotmail.co.uk",
            weeks_delivered: "1",
            first_order_date: "10/8/20",
        },
        {
            email: "maurice_geheniau@hotmail.com",
            weeks_delivered: "11",
            first_order_date: "10/8/20",
        },
        {
            email: "ariana.farsai@gmail.com",
            weeks_delivered: "17",
            first_order_date: "10/8/20",
        },
        {
            email: "plara009@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "10/9/20",
        },
        {
            email: "mandimoo19@hotmail.com",
            weeks_delivered: "29",
            first_order_date: "10/9/20",
        },
        {
            email: "karinfujimoto@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/9/20",
        },
        {
            email: "toms.varpins@gmail.com",
            weeks_delivered: "19",
            first_order_date: "10/9/20",
        },
        {
            email: "maria.fernandezds@gmail.com",
            weeks_delivered: "14",
            first_order_date: "10/9/20",
        },
        {
            email: "max@kramer.es",
            weeks_delivered: "22",
            first_order_date: "10/11/20",
        },
        {
            email: "romeo.lauren@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/12/20",
        },
        {
            email: "daniils.suhovs@gmail.com",
            weeks_delivered: "6",
            first_order_date: "10/13/20",
        },
        {
            email: "yarapaoli@gmail.com",
            weeks_delivered: "15",
            first_order_date: "10/14/20",
        },
        {
            email: "mashagomez@gmail.com",
            weeks_delivered: "29",
            first_order_date: "10/14/20",
        },
        {
            email: "cnvalencia14@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/15/20",
        },
        {
            email: "guillnf@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/15/20",
        },
        {
            email: "amandinedieval@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/15/20",
        },
        {
            email: "taraboudreau0111@gmail.com",
            weeks_delivered: "29",
            first_order_date: "10/15/20",
        },
        {
            email: "nflotats@alfatei.com",
            weeks_delivered: "1",
            first_order_date: "10/16/20",
        },
        {
            email: "tawnie.farinez@gmail.com",
            weeks_delivered: "16",
            first_order_date: "10/16/20",
        },
        {
            email: "antoine.eripret@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/16/20",
        },
        {
            email: "emmy.lindstam@gmail.com",
            weeks_delivered: "39",
            first_order_date: "10/17/20",
        },
        {
            email: "martaw.poczta@gmail.com",
            weeks_delivered: "17",
            first_order_date: "10/17/20",
        },
        {
            email: "gabor.endre.ormos@gmail.com",
            weeks_delivered: "26",
            first_order_date: "10/18/20",
        },
        {
            email: "david.a.king11@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/18/20",
        },
        {
            email: "gillian.patterson@socialpoint.es",
            weeks_delivered: "15",
            first_order_date: "10/19/20",
        },
        {
            email: "llazaro90@hotmail.com",
            weeks_delivered: "35",
            first_order_date: "10/19/20",
        },
        {
            email: "mdomen14@xtec.cat",
            weeks_delivered: "3",
            first_order_date: "10/20/20",
        },
        {
            email: "carolinamahia@outlook.com",
            weeks_delivered: "37",
            first_order_date: "10/20/20",
        },
        {
            email: "saskiarj@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/21/20",
        },
        {
            email: "sbustio@hotmail.com",
            weeks_delivered: "27",
            first_order_date: "10/22/20",
        },
        {
            email: "jeangoutceline@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/22/20",
        },
        {
            email: "paszkiewiczpamela@yahoo.ie",
            weeks_delivered: "1",
            first_order_date: "10/22/20",
        },
        {
            email: "froque@asbarcelona.com",
            weeks_delivered: "35",
            first_order_date: "10/23/20",
        },
        {
            email: "juanhernandezesesoyyo@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/23/20",
        },
        {
            email: "olgazhakova@yahoo.com",
            weeks_delivered: "26",
            first_order_date: "10/23/20",
        },
        {
            email: "renatarene948@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/23/20",
        },
        {
            email: "hslockwood@gmail.com",
            weeks_delivered: "49",
            first_order_date: "10/24/20",
        },
        {
            email: "rltracy29@gmail.com",
            weeks_delivered: "55",
            first_order_date: "10/25/20",
        },
        {
            email: "iska@ifigroup.it",
            weeks_delivered: "27",
            first_order_date: "10/26/20",
        },
        {
            email: "louboillod@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/27/20",
        },
        {
            email: "ursula.thibault@gmail.com",
            weeks_delivered: "54",
            first_order_date: "10/28/20",
        },
        {
            email: "sashawood2017@gmail.com",
            weeks_delivered: "38",
            first_order_date: "10/28/20",
        },
        {
            email: "alexandra.vall.rojo@gmail.com",
            weeks_delivered: "25",
            first_order_date: "10/28/20",
        },
        {
            email: "valera.manu@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/28/20",
        },
        {
            email: "jannes.wigerinck@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "10/29/20",
        },
        {
            email: "amranigonzalezlaila@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/29/20",
        },
        {
            email: "fetchebarne@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/30/20",
        },
        {
            email: "fel.ledesma@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/30/20",
        },
        {
            email: "liurika@hotmail.com",
            weeks_delivered: "15",
            first_order_date: "10/31/20",
        },
        {
            email: "kaitlinkemp@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/31/20",
        },
        {
            email: "ampafla@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/31/20",
        },
        {
            email: "vansatri@hotmail.com",
            weeks_delivered: "12",
            first_order_date: "11/1/20",
        },
        {
            email: "flaquefrancisca@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/1/20",
        },
        {
            email: "evandroccarmo@gmail.com",
            weeks_delivered: "23",
            first_order_date: "11/2/20",
        },
        {
            email: "helmy.cc@gmail.com",
            weeks_delivered: "45",
            first_order_date: "11/2/20",
        },
        {
            email: "Lorena.blickhaeuser@yahoo.de",
            weeks_delivered: "30",
            first_order_date: "11/3/20",
        },
        {
            email: "annekagonzalezinga@gmail.com",
            weeks_delivered: "7",
            first_order_date: "11/3/20",
        },
        {
            email: "richard@gargan.com",
            weeks_delivered: "47",
            first_order_date: "11/3/20",
        },
        {
            email: "emetzeitz@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/4/20",
        },
        {
            email: "amypoor3@gmail.com",
            weeks_delivered: "31",
            first_order_date: "11/4/20",
        },
        {
            email: "cnegrerosell@gmail.com",
            weeks_delivered: "33",
            first_order_date: "11/5/20",
        },
        {
            email: "gabenemail@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/5/20",
        },
        {
            email: "lizoswald@gmail.com",
            weeks_delivered: "9",
            first_order_date: "11/5/20",
        },
        {
            email: "joannaprzewlocka@wp.pl",
            weeks_delivered: "56",
            first_order_date: "11/5/20",
        },
        {
            email: "agnieszka.cymler@ymail.com",
            weeks_delivered: "19",
            first_order_date: "11/5/20",
        },
        {
            email: "osknoes@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/6/20",
        },
        {
            email: "sebiheinath@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/7/20",
        },
        {
            email: "arturo.madrid@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/8/20",
        },
        {
            email: "missangemarie@hotmail.com",
            weeks_delivered: "11",
            first_order_date: "11/8/20",
        },
        {
            email: "porto.vga@gmail.com",
            weeks_delivered: "16",
            first_order_date: "11/8/20",
        },
        {
            email: "dmitrii.riabukha@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/9/20",
        },
        {
            email: "montpinyol@hotmail.com",
            weeks_delivered: "29",
            first_order_date: "11/9/20",
        },
        {
            email: "b.reduce@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/9/20",
        },
        {
            email: "kay_jeffrey@hotmail.com",
            weeks_delivered: "31",
            first_order_date: "11/9/20",
        },
        {
            email: "RACHEL_D6@HOTMAIL.COM",
            weeks_delivered: "51",
            first_order_date: "11/10/20",
        },
        {
            email: "mariasimoricart@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/11/20",
        },
        {
            email: "javier.mas93@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/12/20",
        },
        {
            email: "sarramechri@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/13/20",
        },
        {
            email: "julissakiyenje@gmail.com",
            weeks_delivered: "34",
            first_order_date: "11/13/20",
        },
        {
            email: "alexandra@aletras.com",
            weeks_delivered: "39",
            first_order_date: "11/13/20",
        },
        {
            email: "lusouza.and@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/13/20",
        },
        {
            email: "Dimitri.spolspoel@gmail.com",
            weeks_delivered: "13",
            first_order_date: "11/13/20",
        },
        {
            email: "flavia.trinidad@gmail.com",
            weeks_delivered: "21",
            first_order_date: "11/14/20",
        },
        {
            email: "ella.lane15@outlook.com",
            weeks_delivered: "20",
            first_order_date: "11/14/20",
        },
        {
            email: "alejandra.banay@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/16/20",
        },
        {
            email: "jaz.vuytrea@gmail.com",
            weeks_delivered: "28",
            first_order_date: "11/17/20",
        },
        {
            email: "carrielillie@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/17/20",
        },
        {
            email: "mariecorbais@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/17/20",
        },
        {
            email: "lupu_gabriela83@hotmail.es",
            weeks_delivered: "12",
            first_order_date: "11/18/20",
        },
        {
            email: "shawnkyzer@gmail.com",
            weeks_delivered: "30",
            first_order_date: "11/19/20",
        },
        {
            email: "marie.graf@hotmail.de",
            weeks_delivered: "1",
            first_order_date: "11/19/20",
        },
        {
            email: "alawless@es-school.com",
            weeks_delivered: "12",
            first_order_date: "11/19/20",
        },
        {
            email: "joshcaterham@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/19/20",
        },
        {
            email: "annagr2002@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/19/20",
        },
        {
            email: "riqui1993@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/19/20",
        },
        {
            email: "lucie.rosa.lanham@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/19/20",
        },
        {
            email: "jabogo96@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/20/20",
        },
        {
            email: "farmijo16@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/20/20",
        },
        {
            email: "davidibanezsiguero@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/21/20",
        },
        {
            email: "henry.schafer.harrison@gmail.com",
            weeks_delivered: "27",
            first_order_date: "11/21/20",
        },
        {
            email: "galibelle.barcelona.arenas@gmail.com",
            weeks_delivered: "30",
            first_order_date: "11/22/20",
        },
        {
            email: "f.artigasventola@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/22/20",
        },
        {
            email: "jolantasz17@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/22/20",
        },
        {
            email: "amirdov@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/23/20",
        },
        {
            email: "noemiecmichot@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/24/20",
        },
        {
            email: "ague15j@gmail.com",
            weeks_delivered: "16",
            first_order_date: "11/24/20",
        },
        {
            email: "lucave48@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/22/20",
        },
        {
            email: "benjaminlefebvre@hotmail.de",
            weeks_delivered: "1",
            first_order_date: "11/26/20",
        },
        {
            email: "gbarreracastillo@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/26/20",
        },
        {
            email: "anastasiaplotnikova94@gmail.com",
            weeks_delivered: "14",
            first_order_date: "11/26/20",
        },
        {
            email: "pedro.benka@gmail.com",
            weeks_delivered: "42",
            first_order_date: "11/27/20",
        },
        {
            email: "sara.orozco83@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/28/20",
        },
        {
            email: "varasnuria@gmail.com",
            weeks_delivered: "44",
            first_order_date: "11/28/20",
        },
        {
            email: "susannengelhardt@aol.com",
            weeks_delivered: "6",
            first_order_date: "11/29/20",
        },
        {
            email: "ramirobarbero@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/30/20",
        },
        {
            email: "natalia.sacilotto@gmail.com",
            weeks_delivered: "32",
            first_order_date: "11/30/20",
        },
        {
            email: "toniherrerazurita@gmail.com",
            weeks_delivered: "24",
            first_order_date: "12/1/20",
        },
        {
            email: "bruno.deluiggi@iese.net",
            weeks_delivered: "5",
            first_order_date: "12/1/20",
        },
        {
            email: "roi.driscoll@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/1/20",
        },
        {
            email: "raquelrag@gmail.com",
            weeks_delivered: "46",
            first_order_date: "12/3/20",
        },
        {
            email: "naticarta@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "12/4/20",
        },
        {
            email: "rvrunckel@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/4/20",
        },
        {
            email: "suzannevanbrunschot76@gmail.com",
            weeks_delivered: "25",
            first_order_date: "12/6/20",
        },
        {
            email: "plassart@gmail.com",
            weeks_delivered: "40",
            first_order_date: "12/6/20",
        },
        {
            email: "teo.voire@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/7/20",
        },
        {
            email: "craig.halgreen@gmail.com",
            weeks_delivered: "3",
            first_order_date: "12/8/20",
        },
        {
            email: "wustmateo@gmail.com",
            weeks_delivered: "19",
            first_order_date: "12/8/20",
        },
        {
            email: "shamousk@gmail.com",
            weeks_delivered: "22",
            first_order_date: "12/9/20",
        },
        {
            email: "jvoare@suecos.com",
            weeks_delivered: "33",
            first_order_date: "12/10/20",
        },
        {
            email: "a.garcia.just@gmail.com",
            weeks_delivered: "24",
            first_order_date: "12/11/20",
        },
        {
            email: "zureikat@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/12/20",
        },
        {
            email: "juarezinsf@gmail.com",
            weeks_delivered: "15",
            first_order_date: "12/14/20",
        },
        {
            email: "daniela.eriksson@live.co.uk",
            weeks_delivered: "1",
            first_order_date: "12/14/20",
        },
        {
            email: "emilyvholgate@gmail.com",
            weeks_delivered: "35",
            first_order_date: "12/15/20",
        },
        {
            email: "m4rklar@gmail.com",
            weeks_delivered: "25",
            first_order_date: "12/17/20",
        },
        {
            email: "janet.rios1663@gmail.com",
            weeks_delivered: "15",
            first_order_date: "12/17/20",
        },
        {
            email: "nuyilprods@gmail.com",
            weeks_delivered: "21",
            first_order_date: "12/27/20",
        },
        {
            email: "eynelpilatowsky@gmail.com",
            weeks_delivered: "43",
            first_order_date: "12/29/20",
        },
        {
            email: "sophievingham@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/30/20",
        },
        {
            email: "contact@pieterbailleul.be",
            weeks_delivered: "39",
            first_order_date: "1/2/21",
        },
        {
            email: "parry.my@gmail.com",
            weeks_delivered: "18",
            first_order_date: "1/3/21",
        },
        {
            email: "laetitiamartinot@gmail.com",
            weeks_delivered: "16",
            first_order_date: "1/3/21",
        },
        {
            email: "gassol.isaac@gmail.com",
            weeks_delivered: "16",
            first_order_date: "1/4/21",
        },
        {
            email: "capucinednnt@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/5/21",
        },
        {
            email: "pipe_4@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "1/5/21",
        },
        {
            email: "lebeau.thomas@gmail.com",
            weeks_delivered: "20",
            first_order_date: "1/7/21",
        },
        {
            email: "lukas.tanzmayr@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/7/21",
        },
        {
            email: "emmanuel.cabane@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/7/21",
        },
        {
            email: "beiiby@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/8/21",
        },
        {
            email: "llibert.carbonell@gmail.com",
            weeks_delivered: "46",
            first_order_date: "1/9/21",
        },
        {
            email: "milenegq@gmail.com",
            weeks_delivered: "4",
            first_order_date: "1/9/21",
        },
        {
            email: "adnaxls@gmail.com",
            weeks_delivered: "9",
            first_order_date: "1/10/21",
        },
        {
            email: "gnettleton@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/10/21",
        },
        {
            email: "craig@bovis.me.uk",
            weeks_delivered: "36",
            first_order_date: "1/11/21",
        },
        {
            email: "hannah.barnes@ogilvy.com",
            weeks_delivered: "3",
            first_order_date: "1/11/21",
        },
        {
            email: "andresgil_1992@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "1/11/21",
        },
        {
            email: "Hauer.lena.lh@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/11/21",
        },
        {
            email: "jana.hernandez.araujo@gmail.com",
            weeks_delivered: "12",
            first_order_date: "1/11/21",
        },
        {
            email: "vickyw87@hotmail.com",
            weeks_delivered: "14",
            first_order_date: "1/12/21",
        },
        {
            email: "charlinepoullet@hotmail.com",
            weeks_delivered: "16",
            first_order_date: "1/22/21",
        },
        {
            email: "Jonathan_verlaak@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "1/15/21",
        },
        {
            email: "john.clark128@gmail.com",
            weeks_delivered: "28",
            first_order_date: "1/15/21",
        },
        {
            email: "fbargo94@gmail.com",
            weeks_delivered: "11",
            first_order_date: "1/17/21",
        },
        {
            email: "ollyblom@gmail.com",
            weeks_delivered: "36",
            first_order_date: "1/17/21",
        },
        {
            email: "eva.groot@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "1/17/21",
        },
        {
            email: "tg.pick92@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/18/21",
        },
        {
            email: "hi@baran.fyi",
            weeks_delivered: "11",
            first_order_date: "1/18/21",
        },
        {
            email: "m.londono.clayton@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/19/21",
        },
        {
            email: "helene.fluit@gmail.com",
            weeks_delivered: "3",
            first_order_date: "1/19/21",
        },
        {
            email: "hbarclay229@gmail.com",
            weeks_delivered: "42",
            first_order_date: "1/20/21",
        },
        {
            email: "Keijer@hotmail.com",
            weeks_delivered: "38",
            first_order_date: "1/20/21",
        },
        {
            email: "allalala2012@gmail.com",
            weeks_delivered: "21",
            first_order_date: "1/21/21",
        },
        {
            email: "valeria-2000@mail.ru",
            weeks_delivered: "22",
            first_order_date: "1/22/21",
        },
        {
            email: "matthew.pattemore@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/23/21",
        },
        {
            email: "juliavreintaal@gmail.com",
            weeks_delivered: "11",
            first_order_date: "1/23/21",
        },
        {
            email: "paulcoghill@mac.com",
            weeks_delivered: "6",
            first_order_date: "1/24/21",
        },
        {
            email: "daan0dj@gmail.com",
            weeks_delivered: "30",
            first_order_date: "1/24/21",
        },
        {
            email: "anaiscarolina.ortega@e-campus.uab.cat",
            weeks_delivered: "1",
            first_order_date: "1/25/21",
        },
        {
            email: "benedicte.jacquet@hotmail.fr",
            weeks_delivered: "22",
            first_order_date: "1/25/21",
        },
        {
            email: "asbolsheva@inbox.ru",
            weeks_delivered: "1",
            first_order_date: "1/25/21",
        },
        {
            email: "selvan.senthilkumaran@omt.org.uk",
            weeks_delivered: "17",
            first_order_date: "1/25/21",
        },
        {
            email: "paulasmit13@gmail.com",
            weeks_delivered: "32",
            first_order_date: "1/25/21",
        },
        {
            email: "lukas.kahler@outlook.com",
            weeks_delivered: "24",
            first_order_date: "1/27/21",
        },
        {
            email: "susanavtg@gmail.com",
            weeks_delivered: "2",
            first_order_date: "1/28/21",
        },
        {
            email: "liz8g@hotmail.com",
            weeks_delivered: "22",
            first_order_date: "1/28/21",
        },
        {
            email: "alonsu@gmail.com",
            weeks_delivered: "9",
            first_order_date: "1/29/21",
        },
        {
            email: "Julievdlande@gmail.com",
            weeks_delivered: "16",
            first_order_date: "1/30/21",
        },
        {
            email: "natalianur85@gmail.com",
            weeks_delivered: "1",
            first_order_date: "1/30/21",
        },
        {
            email: "aleselbaum@hotmail.com",
            weeks_delivered: "38",
            first_order_date: "1/31/21",
        },
        {
            email: "danesgreg@gmail.com",
            weeks_delivered: "40",
            first_order_date: "2/1/21",
        },
        {
            email: "catherineannepatterson@gmail.com",
            weeks_delivered: "24",
            first_order_date: "2/1/21",
        },
        {
            email: "matt@stripemedia.com.au",
            weeks_delivered: "2",
            first_order_date: "2/1/21",
        },
        {
            email: "s.morales1994@gmail.com",
            weeks_delivered: "9",
            first_order_date: "2/4/21",
        },
        {
            email: "slopez@aelixtherapeutics.com",
            weeks_delivered: "15",
            first_order_date: "2/5/21",
        },
        {
            email: "nizuqu@gmail.com",
            weeks_delivered: "3",
            first_order_date: "2/5/21",
        },
        {
            email: "kalinaboukova@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/5/21",
        },
        {
            email: "amber.r.rucker@gmail.com",
            weeks_delivered: "6",
            first_order_date: "2/9/21",
        },
        {
            email: "silvia.stockman@gmail.com",
            weeks_delivered: "34",
            first_order_date: "2/9/21",
        },
        {
            email: "amylaurenbarnes@gmail.com",
            weeks_delivered: "5",
            first_order_date: "2/9/21",
        },
        {
            email: "idoiagarriz@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/9/21",
        },
        {
            email: "ricardo.rosa@bayer.com",
            weeks_delivered: "1",
            first_order_date: "2/9/21",
        },
        {
            email: "rosita.cordasco@gmail.com",
            weeks_delivered: "5",
            first_order_date: "2/10/21",
        },
        {
            email: "sandravanrijt@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "2/10/21",
        },
        {
            email: "chloe.logeais@yahoo.fr",
            weeks_delivered: "23",
            first_order_date: "2/11/21",
        },
        {
            email: "josedjeredjian@gmail.com",
            weeks_delivered: "7",
            first_order_date: "2/11/21",
        },
        {
            email: "patricia.lopez.lopez@gmail.com",
            weeks_delivered: "16",
            first_order_date: "2/13/21",
        },
        {
            email: "richard.charlton@socialpoint.es",
            weeks_delivered: "6",
            first_order_date: "2/14/21",
        },
        {
            email: "daairun@hotmail.com",
            weeks_delivered: "10",
            first_order_date: "2/14/21",
        },
        {
            email: "ft.marianaferreira@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/15/21",
        },
        {
            email: "jhargrove95@gmail.com",
            weeks_delivered: "5",
            first_order_date: "2/15/21",
        },
        {
            email: "irissmeekes@live.nl",
            weeks_delivered: "30",
            first_order_date: "2/15/21",
        },
        {
            email: "carvmar82@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/16/21",
        },
        {
            email: "nagels97@live.dk",
            weeks_delivered: "22",
            first_order_date: "10/29/19",
        },
        {
            email: "mlopezr@tauli.cat",
            weeks_delivered: "12",
            first_order_date: "2/21/21",
        },
        {
            email: "jasper.paterson@icloud.com",
            weeks_delivered: "1",
            first_order_date: "2/21/21",
        },
        {
            email: "joshfeldberg@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/22/21",
        },
        {
            email: "wilhelm.s.randers@gmail.com",
            weeks_delivered: "4",
            first_order_date: "2/22/21",
        },
        {
            email: "rony.fadel@gmail.com",
            weeks_delivered: "2",
            first_order_date: "2/22/21",
        },
        {
            email: "ANNAMARIAH94@GMAIL.COM",
            weeks_delivered: "3",
            first_order_date: "2/23/21",
        },
        {
            email: "segard.helene@gmail.com",
            weeks_delivered: "11",
            first_order_date: "2/23/21",
        },
        {
            email: "anna@francesch.com",
            weeks_delivered: "1",
            first_order_date: "2/23/21",
        },
        {
            email: "silvia.castane@gmail.com",
            weeks_delivered: "14",
            first_order_date: "2/23/21",
        },
        {
            email: "oscarjzc6@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/24/21",
        },
        {
            email: "bendinat2@gmail.com",
            weeks_delivered: "9",
            first_order_date: "2/24/21",
        },
        {
            email: "j.laute3@googlemail.com",
            weeks_delivered: "3",
            first_order_date: "2/24/21",
        },
        {
            email: "minibooteille@gmail.com",
            weeks_delivered: "1",
            first_order_date: "2/26/21",
        },
        {
            email: "joniandervishi@gmail.com",
            weeks_delivered: "19",
            first_order_date: "2/28/21",
        },
        {
            email: "sdeberail@gmail.com",
            weeks_delivered: "9",
            first_order_date: "2/28/21",
        },
        {
            email: "cedawkins@gmail.com",
            weeks_delivered: "6",
            first_order_date: "2/28/21",
        },
        {
            email: "doctorfemke@yahoo.com",
            weeks_delivered: "20",
            first_order_date: "2/28/21",
        },
        {
            email: "justynka.s@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/2/21",
        },
        {
            email: "m.junkersvensson@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "2/28/21",
        },
        {
            email: "perillopersonal@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/1/21",
        },
        {
            email: "mfatimavillegas@gmail.com",
            weeks_delivered: "43",
            first_order_date: "3/2/21",
        },
        {
            email: "asliyuruk90@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/4/21",
        },
        {
            email: "gioialue@gmail.com",
            weeks_delivered: "32",
            first_order_date: "3/4/21",
        },
        {
            email: "roelien_de_boer@hotmail.com",
            weeks_delivered: "19",
            first_order_date: "3/7/21",
        },
        {
            email: "jaredair@gmail.com",
            weeks_delivered: "5",
            first_order_date: "3/7/21",
        },
        {
            email: "fguillaj@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/7/21",
        },
        {
            email: "cillalavoie@gmail.com",
            weeks_delivered: "22",
            first_order_date: "3/8/21",
        },
        {
            email: "alfredoelejalde@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/9/21",
        },
        {
            email: "jp@mathi.eu",
            weeks_delivered: "2",
            first_order_date: "3/9/21",
        },
        {
            email: "louesp19@hotmail.com",
            weeks_delivered: "39",
            first_order_date: "3/9/21",
        },
        {
            email: "vcnicholas@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/9/21",
        },
        {
            email: "paula.james78@gmail.com",
            weeks_delivered: "18",
            first_order_date: "3/9/21",
        },
        {
            email: "diana_juarez@hotmail.com",
            weeks_delivered: "15",
            first_order_date: "3/11/21",
        },
        {
            email: "belkin.k@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/11/21",
        },
        {
            email: "c.davidtorresnunez@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/11/21",
        },
        {
            email: "dina.bojanic@gmail.com",
            weeks_delivered: "7",
            first_order_date: "3/11/21",
        },
        {
            email: "montsemarimon1@gmail.com",
            weeks_delivered: "17",
            first_order_date: "3/14/21",
        },
        {
            email: "lizi_rom@hotmail.com",
            weeks_delivered: "34",
            first_order_date: "3/14/21",
        },
        {
            email: "cm.munoz90@gmail.com",
            weeks_delivered: "17",
            first_order_date: "3/14/21",
        },
        {
            email: "evaclaudi@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/14/21",
        },
        {
            email: "apieceoface@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/15/21",
        },
        {
            email: "marianak87@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "3/16/21",
        },
        {
            email: "becajaty@gmail.com",
            weeks_delivered: "35",
            first_order_date: "3/16/21",
        },
        {
            email: "ajhinchliffe92@gmail.com",
            weeks_delivered: "18",
            first_order_date: "3/17/21",
        },
        {
            email: "maria.matecna@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/17/21",
        },
        {
            email: "edward.macgregor@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/17/21",
        },
        {
            email: "inexplicabled@gmail.com",
            weeks_delivered: "33",
            first_order_date: "3/18/21",
        },
        {
            email: "bryer22@gmail.com",
            weeks_delivered: "3",
            first_order_date: "3/19/21",
        },
        {
            email: "qwerty.amith@gmail.com",
            weeks_delivered: "3",
            first_order_date: "3/21/21",
        },
        {
            email: "ari.freixa5@gmail.com",
            weeks_delivered: "19",
            first_order_date: "3/21/21",
        },
        {
            email: "evacoratella@gmail.com",
            weeks_delivered: "3",
            first_order_date: "3/21/21",
        },
        {
            email: "oezlemkaymak@gmail.com",
            weeks_delivered: "8",
            first_order_date: "3/23/21",
        },
        {
            email: "mariadelmar.ordonez@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/24/21",
        },
        {
            email: "femke_guldemond@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "3/24/21",
        },
        {
            email: "hugo.mm.magalhaes+lc@gmail.com",
            weeks_delivered: "33",
            first_order_date: "3/28/21",
        },
        {
            email: "roberto.cerquetani@googlemail.com",
            weeks_delivered: "1",
            first_order_date: "3/29/21",
        },
        {
            email: "quirine@quirine.es",
            weeks_delivered: "22",
            first_order_date: "3/29/21",
        },
        {
            email: "marionbalinoff@gmail.com",
            weeks_delivered: "2",
            first_order_date: "3/29/21",
        },
        {
            email: "dmitry.vecheruk@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/29/21",
        },
        {
            email: "susanjnell@gmail.com",
            weeks_delivered: "18",
            first_order_date: "3/30/21",
        },
        {
            email: "ignasi.riviere@gmail.com",
            weeks_delivered: "13",
            first_order_date: "3/31/21",
        },
        {
            email: "mfoyaca@gmail.com",
            weeks_delivered: "18",
            first_order_date: "3/31/21",
        },
        {
            email: "ariane.simonelis@gmail.com",
            weeks_delivered: "1",
            first_order_date: "3/31/21",
        },
        {
            email: "dccarmo@gmail.com",
            weeks_delivered: "12",
            first_order_date: "4/1/21",
        },
        {
            email: "beata.anna.jaskula@gmail.com",
            weeks_delivered: "20",
            first_order_date: "4/1/21",
        },
        {
            email: "vinicius@horewi.cz",
            weeks_delivered: "4",
            first_order_date: "4/2/21",
        },
        {
            email: "oscarmontserratprat@gmail.com",
            weeks_delivered: "13",
            first_order_date: "4/6/21",
        },
        {
            email: "alicia-carrillo@hotmail.com",
            weeks_delivered: "9",
            first_order_date: "4/6/21",
        },
        {
            email: "vicky_picis@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "4/6/21",
        },
        {
            email: "sam.moyse@gmail.com",
            weeks_delivered: "28",
            first_order_date: "4/7/21",
        },
        {
            email: "lbardaji@bbabogadas.com",
            weeks_delivered: "36",
            first_order_date: "4/7/21",
        },
        {
            email: "jose.camacho@ubisoft.com",
            weeks_delivered: "18",
            first_order_date: "4/8/21",
        },
        {
            email: "mcotton81@yahoo.com",
            weeks_delivered: "5",
            first_order_date: "4/8/21",
        },
        {
            email: "coppinmarjorie@orange.fr",
            weeks_delivered: "5",
            first_order_date: "4/9/21",
        },
        {
            email: "sbardoula93@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/9/21",
        },
        {
            email: "kruasanchik698@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/11/21",
        },
        {
            email: "juanestebanp94@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/12/21",
        },
        {
            email: "saskia_van_der_hoeven@hotmail.com",
            weeks_delivered: "8",
            first_order_date: "4/13/21",
        },
        {
            email: "varkoly.dora@gmail.com",
            weeks_delivered: "12",
            first_order_date: "4/14/21",
        },
        {
            email: "daniel.gwercher@me.com",
            weeks_delivered: "2",
            first_order_date: "4/13/21",
        },
        {
            email: "luisjaner8@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/15/21",
        },
        {
            email: "fcabal.indecosa@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/15/21",
        },
        {
            email: "dora.lacey@gmail.com",
            weeks_delivered: "7",
            first_order_date: "4/15/21",
        },
        {
            email: "waldo.m@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/15/21",
        },
        {
            email: "mmr9731@rit.edu",
            weeks_delivered: "2",
            first_order_date: "4/15/21",
        },
        {
            email: "ovendrell@icab.cat",
            weeks_delivered: "9",
            first_order_date: "4/15/21",
        },
        {
            email: "rociobsanchez@gmail.com",
            weeks_delivered: "33",
            first_order_date: "4/21/21",
        },
        {
            email: "am.giraldo77@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/20/21",
        },
        {
            email: "fazkris@yahoo.de",
            weeks_delivered: "2",
            first_order_date: "4/20/21",
        },
        {
            email: "marina3_gs@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "4/19/21",
        },
        {
            email: "lisaglimvik@hotmail.com",
            weeks_delivered: "20",
            first_order_date: "4/20/21",
        },
        {
            email: "simone_kajita@yahoo.com.br",
            weeks_delivered: "26",
            first_order_date: "4/21/21",
        },
        {
            email: "aralarre@gmail.com",
            weeks_delivered: "30",
            first_order_date: "4/21/21",
        },
        {
            email: "schenonesoledad@gmail.com",
            weeks_delivered: "8",
            first_order_date: "4/22/21",
        },
        {
            email: "mialucci@me.com",
            weeks_delivered: "10",
            first_order_date: "4/22/21",
        },
        {
            email: "nataliaantonova1990@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/23/21",
        },
        {
            email: "antonellasoledadsardi@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/23/21",
        },
        {
            email: "brittaheisterkamp@gmail.com",
            weeks_delivered: "8",
            first_order_date: "4/24/21",
        },
        {
            email: "jeremy.cuif@gmail.com",
            weeks_delivered: "18",
            first_order_date: "4/25/21",
        },
        {
            email: "alexander.dyachenko@gmail.com",
            weeks_delivered: "13",
            first_order_date: "4/25/21",
        },
        {
            email: "s.j.vestit@gmail.com",
            weeks_delivered: "22",
            first_order_date: "11/17/19",
        },
        {
            email: "dianaaustin02@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/27/21",
        },
        {
            email: "alejandrogm3600@gmail.com",
            weeks_delivered: "2",
            first_order_date: "4/28/21",
        },
        {
            email: "judit.ferrerf@gmail.com",
            weeks_delivered: "1",
            first_order_date: "4/28/21",
        },
        {
            email: "miekebunk@mac.com",
            weeks_delivered: "29",
            first_order_date: "4/30/21",
        },
        {
            email: "mariebnordby@gmail.com",
            weeks_delivered: "5",
            first_order_date: "4/30/21",
        },
        {
            email: "sv.esmoris@gmail.com",
            weeks_delivered: "8",
            first_order_date: "5/2/21",
        },
        {
            email: "baptiste.richard2020@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/3/21",
        },
        {
            email: "tombaq_88@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "5/5/21",
        },
        {
            email: "gianluca.gandini@gmail.com",
            weeks_delivered: "3",
            first_order_date: "5/6/21",
        },
        {
            email: "nic.velho@gmail.com",
            weeks_delivered: "20",
            first_order_date: "5/6/21",
        },
        {
            email: "nborovac@gmail.com",
            weeks_delivered: "22",
            first_order_date: "5/6/21",
        },
        {
            email: "daniilpopl1111@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/7/21",
        },
        {
            email: "cosmin.es@gmail.com",
            weeks_delivered: "2",
            first_order_date: "5/7/21",
        },
        {
            email: "guericm@hotmail.fr",
            weeks_delivered: "5",
            first_order_date: "5/7/21",
        },
        {
            email: "agata.winowska@gmail.com",
            weeks_delivered: "29",
            first_order_date: "5/7/21",
        },
        {
            email: "nina.brumma@googlemail.com",
            weeks_delivered: "27",
            first_order_date: "5/9/21",
        },
        {
            email: "mariah.girouard@gmail.com",
            weeks_delivered: "25",
            first_order_date: "5/10/21",
        },
        {
            email: "mada.damien@gmail.com",
            weeks_delivered: "24",
            first_order_date: "5/10/21",
        },
        {
            email: "mr.gill@gmail.com",
            weeks_delivered: "29",
            first_order_date: "5/10/21",
        },
        {
            email: "marcmarin88@gmail.com",
            weeks_delivered: "17",
            first_order_date: "5/11/21",
        },
        {
            email: "lara.teruel@gmail.com",
            weeks_delivered: "2",
            first_order_date: "5/12/21",
        },
        {
            email: "jordi@disfrutaverdura.com",
            weeks_delivered: "2",
            first_order_date: "5/14/21",
        },
        {
            email: "jul.pasechnik@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/15/21",
        },
        {
            email: "vgoslow@gmail.com",
            weeks_delivered: "4",
            first_order_date: "5/16/21",
        },
        {
            email: "jaxmac5@aol.com",
            weeks_delivered: "23",
            first_order_date: "5/17/21",
        },
        {
            email: "stephanievdhoeven@gmail.com",
            weeks_delivered: "21",
            first_order_date: "5/17/21",
        },
        {
            email: "oanamaria.dinca@gmail.com",
            weeks_delivered: "6",
            first_order_date: "5/19/21",
        },
        {
            email: "clau2acjx@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "5/17/21",
        },
        {
            email: "esteban.pratolongo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/16/21",
        },
        {
            email: "svmendelsohn@gmail.com",
            weeks_delivered: "29",
            first_order_date: "5/21/21",
        },
        {
            email: "bo13linnsvensson@gmail.com",
            weeks_delivered: "24",
            first_order_date: "5/24/21",
        },
        {
            email: "malin.ec.svensson@gmail.com",
            weeks_delivered: "6",
            first_order_date: "5/25/21",
        },
        {
            email: "gabrieltejerina@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/25/21",
        },
        {
            email: "mariaplazaangulo@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "5/26/21",
        },
        {
            email: "pau1es@hotmail.com",
            weeks_delivered: "7",
            first_order_date: "5/31/21",
        },
        {
            email: "agmezadelama@gmail.com",
            weeks_delivered: "15",
            first_order_date: "10/29/19",
        },
        {
            email: "aalewis1@me.com",
            weeks_delivered: "20",
            first_order_date: "5/31/21",
        },
        {
            email: "marc.altayo@gmail.com",
            weeks_delivered: "9",
            first_order_date: "5/28/21",
        },
        {
            email: "taniagrisan@gmail.com",
            weeks_delivered: "1",
            first_order_date: "5/31/21",
        },
        {
            email: "xavierbordasp@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/2/21",
        },
        {
            email: "quark82@gmail.com",
            weeks_delivered: "29",
            first_order_date: "6/2/21",
        },
        {
            email: "alisonleonard08@gmail.com",
            weeks_delivered: "3",
            first_order_date: "6/2/21",
        },
        {
            email: "badetomruk@hotmail.com",
            weeks_delivered: "16",
            first_order_date: "6/3/21",
        },
        {
            email: "elenakhar@gmail.com",
            weeks_delivered: "10",
            first_order_date: "6/4/21",
        },
        {
            email: "marta_ventura@live.com.pt",
            weeks_delivered: "11",
            first_order_date: "6/4/21",
        },
        {
            email: "fendy.cg28@gmail.com",
            weeks_delivered: "30",
            first_order_date: "6/6/21",
        },
        {
            email: "mpalesarredonda@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/9/21",
        },
        {
            email: "daisyvanderheijden@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/9/21",
        },
        {
            email: "naabeel412@gmail.com",
            weeks_delivered: "4",
            first_order_date: "6/11/21",
        },
        {
            email: "louisevind@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/13/21",
        },
        {
            email: "Maxi.schumm@gmail.com",
            weeks_delivered: "29",
            first_order_date: "6/13/21",
        },
        {
            email: "lyuba.golovina@gmail.com",
            weeks_delivered: "26",
            first_order_date: "6/13/21",
        },
        {
            email: "flor.vilardebo@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/15/21",
        },
        {
            email: "jose.godoi@huddling.com.br",
            weeks_delivered: "20",
            first_order_date: "6/16/21",
        },
        {
            email: "ntaibah@gmail.com",
            weeks_delivered: "10",
            first_order_date: "6/17/21",
        },
        {
            email: "sales@restauraniza.com",
            weeks_delivered: "1",
            first_order_date: "6/22/21",
        },
        {
            email: "msanoja87@gmail.com",
            weeks_delivered: "17",
            first_order_date: "6/23/21",
        },
        {
            email: "yashar.khazdouzian@gmail.com",
            weeks_delivered: "10",
            first_order_date: "6/23/21",
        },
        {
            email: "xavier@antoviaque.org",
            weeks_delivered: "4",
            first_order_date: "6/24/21",
        },
        {
            email: "ramona.ziegler27@gmail.com",
            weeks_delivered: "15",
            first_order_date: "6/24/21",
        },
        {
            email: "ali.aljishi@live.com",
            weeks_delivered: "2",
            first_order_date: "6/25/21",
        },
        {
            email: "betofrance@gmail.com",
            weeks_delivered: "1",
            first_order_date: "6/25/21",
        },
        {
            email: "anastasiadema@gmail.com",
            weeks_delivered: "9",
            first_order_date: "6/27/21",
        },
        {
            email: "anametz@gmail.com",
            weeks_delivered: "2",
            first_order_date: "6/27/21",
        },
        {
            email: "chandro.notten@outlook.com",
            weeks_delivered: "3",
            first_order_date: "6/30/21",
        },
        {
            email: "cesare.cugnasco@gmail.com",
            weeks_delivered: "15",
            first_order_date: "6/30/21",
        },
        {
            email: "laurakmason@gmail.com",
            weeks_delivered: "3",
            first_order_date: "7/1/21",
        },
        {
            email: "manelvelmai2010@gmail.com",
            weeks_delivered: "1",
            first_order_date: "7/2/21",
        },
        {
            email: "novajose@gmail.com",
            weeks_delivered: "3",
            first_order_date: "7/7/21",
        },
        {
            email: "tim.mutimer@mac.com",
            weeks_delivered: "3",
            first_order_date: "7/8/21",
        },
        {
            email: "mf792@hotmail.com",
            weeks_delivered: "9",
            first_order_date: "7/8/21",
        },
        {
            email: "triciamparris@gmail.com",
            weeks_delivered: "14",
            first_order_date: "7/9/21",
        },
        {
            email: "isabellabiancotti@gmail.com",
            weeks_delivered: "20",
            first_order_date: "7/15/21",
        },
        {
            email: "cornelieschungel@gmail.com",
            weeks_delivered: "16",
            first_order_date: "7/16/21",
        },
        {
            email: "c_jenek@mail.ru",
            weeks_delivered: "19",
            first_order_date: "7/17/21",
        },
        {
            email: "leboulicaut.oliver@gmail.com",
            weeks_delivered: "2",
            first_order_date: "7/19/21",
        },
        {
            email: "domnech@gmail.com",
            weeks_delivered: "8",
            first_order_date: "7/20/21",
        },
        {
            email: "randal.a.moore@gmail.com",
            weeks_delivered: "20",
            first_order_date: "7/22/21",
        },
        {
            email: "gabrisa-fm@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "7/25/21",
        },
        {
            email: "nicoleta.n.badea@gmail.com",
            weeks_delivered: "4",
            first_order_date: "7/26/21",
        },
        {
            email: "david.alejandro.negrete@gmail.com",
            weeks_delivered: "7",
            first_order_date: "7/26/21",
        },
        {
            email: "elisabetbf@hotmail.com",
            weeks_delivered: "12",
            first_order_date: "7/27/21",
        },
        {
            email: "miasilveira@gmail.com",
            weeks_delivered: "11",
            first_order_date: "7/29/21",
        },
        {
            email: "victoriaross83@gmail.com",
            weeks_delivered: "7",
            first_order_date: "8/2/21",
        },
        {
            email: "tutty_1987@icloud.com",
            weeks_delivered: "3",
            first_order_date: "8/3/21",
        },
        {
            email: "mkelly6434@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/3/21",
        },
        {
            email: "seriol.silvia@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/4/21",
        },
        {
            email: "nualadoyle12@gmail.com",
            weeks_delivered: "13",
            first_order_date: "8/5/21",
        },
        {
            email: "josebragv@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/6/21",
        },
        {
            email: "aoyamaayako@gmail.com",
            weeks_delivered: "14",
            first_order_date: "8/8/21",
        },
        {
            email: "galing@gmx.net",
            weeks_delivered: "5",
            first_order_date: "8/8/21",
        },
        {
            email: "lauramonforte@gmail.com",
            weeks_delivered: "17",
            first_order_date: "8/9/21",
        },
        {
            email: "mironanicola@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/9/21",
        },
        {
            email: "dimelzaosorio@gmail.com",
            weeks_delivered: "17",
            first_order_date: "8/10/21",
        },
        {
            email: "mattjaemie@gmail.com",
            weeks_delivered: "7",
            first_order_date: "8/15/21",
        },
        {
            email: "simon.wolf1994@gmail.com",
            weeks_delivered: "1",
            first_order_date: "8/16/21",
        },
        {
            email: "dvasupremo@gmail.com",
            weeks_delivered: "11",
            first_order_date: "8/18/21",
        },
        {
            email: "jcespinosa@gmail.com",
            weeks_delivered: "3",
            first_order_date: "8/20/21",
        },
        {
            email: "nspainw@gmail.com",
            weeks_delivered: "8",
            first_order_date: "8/21/21",
        },
        {
            email: "davidgd24@gmail.com",
            weeks_delivered: "6",
            first_order_date: "8/23/21",
        },
        {
            email: "derekpreheim@gmail.com",
            weeks_delivered: "3",
            first_order_date: "8/23/21",
        },
        {
            email: "leonardhalling@gmail.com",
            weeks_delivered: "4",
            first_order_date: "8/27/21",
        },
        {
            email: "marta.cusso@gmail.com",
            weeks_delivered: "17",
            first_order_date: "8/27/21",
        },
        {
            email: "email@maciej.one",
            weeks_delivered: "8",
            first_order_date: "8/28/21",
        },
        {
            email: "dirkzwager.aimee@hotmail.com",
            weeks_delivered: "13",
            first_order_date: "8/28/21",
        },
        {
            email: "epeterfreer@gmail.com",
            weeks_delivered: "15",
            first_order_date: "8/30/21",
        },
        {
            email: "NikolayNenov@gmail.com",
            weeks_delivered: "16",
            first_order_date: "8/31/21",
        },
        {
            email: "kjsalvany@gmail.com",
            weeks_delivered: "13",
            first_order_date: "8/31/21",
        },
        {
            email: "facturacio@campjoliu.net",
            weeks_delivered: "10",
            first_order_date: "9/2/21",
        },
        {
            email: "eddie.cantoni96@gmail.com",
            weeks_delivered: "14",
            first_order_date: "9/2/21",
        },
        {
            email: "maxkapitonov@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/2/21",
        },
        {
            email: "sasso.sabrina@outlook.com",
            weeks_delivered: "1",
            first_order_date: "9/2/21",
        },
        {
            email: "celia.bernazzani@hotmail.fr",
            weeks_delivered: "2",
            first_order_date: "9/3/21",
        },
        {
            email: "phooky@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "9/3/21",
        },
        {
            email: "lynnette.wt.ang@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/4/21",
        },
        {
            email: "thomas_leenen@hotmail.com",
            weeks_delivered: "17",
            first_order_date: "9/4/21",
        },
        {
            email: "jeroenveenn@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/4/21",
        },
        {
            email: "andy.weight@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/5/21",
        },
        {
            email: "abdulazizaradi@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "9/5/21",
        },
        {
            email: "danilova.maria.k@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/7/21",
        },
        {
            email: "marc@keynest.com",
            weeks_delivered: "2",
            first_order_date: "9/7/21",
        },
        {
            email: "3lena.mar3@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/7/21",
        },
        {
            email: "raphadavid@gmail.com",
            weeks_delivered: "16",
            first_order_date: "9/7/21",
        },
        {
            email: "crodriguezribas@gmail.com",
            weeks_delivered: "13",
            first_order_date: "9/8/21",
        },
        {
            email: "nicolaucavaller@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/8/21",
        },
        {
            email: "sdellafaille@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/8/21",
        },
        {
            email: "lisaspaans@live.nl",
            weeks_delivered: "6",
            first_order_date: "9/10/21",
        },
        {
            email: "jecwells@yahoo.co.uk",
            weeks_delivered: "1",
            first_order_date: "9/11/21",
        },
        {
            email: "dasha_perekrestenko@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "9/13/21",
        },
        {
            email: "luismiguelru1992@gmail.com",
            weeks_delivered: "11",
            first_order_date: "9/12/21",
        },
        {
            email: "irene.vilar.arcarons@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/16/21",
        },
        {
            email: "kadjianais@gmail.com",
            weeks_delivered: "4",
            first_order_date: "9/17/21",
        },
        {
            email: "sfurede@aol.com",
            weeks_delivered: "10",
            first_order_date: "9/17/21",
        },
        {
            email: "mgreen17@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/18/21",
        },
        {
            email: "benedicte_walter@yahoo.fr",
            weeks_delivered: "3",
            first_order_date: "9/19/21",
        },
        {
            email: "alvaro_g90@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "9/19/21",
        },
        {
            email: "anais.lamarti@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/19/21",
        },
        {
            email: "goasdoue.picot@gmail.com",
            weeks_delivered: "11",
            first_order_date: "9/20/21",
        },
        {
            email: "sofia.bezzato@gmail.com",
            weeks_delivered: "1",
            first_order_date: "9/20/21",
        },
        {
            email: "kirkjane18@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/16/21",
        },
        {
            email: "shalini.bh@gmail.com",
            weeks_delivered: "13",
            first_order_date: "9/21/21",
        },
        {
            email: "lucilledubos@gmail.com",
            weeks_delivered: "5",
            first_order_date: "9/22/21",
        },
        {
            email: "martitr2010@gmail.com",
            weeks_delivered: "2",
            first_order_date: "9/22/21",
        },
        {
            email: "laraghlarsen@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/23/21",
        },
        {
            email: "hanne_dv@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "9/24/21",
        },
        {
            email: "dorienvanriel@gmail.com",
            weeks_delivered: "7",
            first_order_date: "9/24/21",
        },
        {
            email: "erik.wengefelt@gmail.com",
            weeks_delivered: "11",
            first_order_date: "9/24/21",
        },
        {
            email: "Florenciastella@outlook.com",
            weeks_delivered: "5",
            first_order_date: "9/24/21",
        },
        {
            email: "anwb8279@gmail.com",
            weeks_delivered: "11",
            first_order_date: "9/25/21",
        },
        {
            email: "whatsoever@mail.ru",
            weeks_delivered: "2",
            first_order_date: "9/26/21",
        },
        {
            email: "koolaiho@gmail.com",
            weeks_delivered: "10",
            first_order_date: "9/27/21",
        },
        {
            email: "tanea_doaga@yahoo.com",
            weeks_delivered: "6",
            first_order_date: "9/27/21",
        },
        {
            email: "heddastellefsen@gmail.com",
            weeks_delivered: "3",
            first_order_date: "9/28/21",
        },
        {
            email: "attiya.abdulghany@gmail.com",
            weeks_delivered: "8",
            first_order_date: "9/28/21",
        },
        {
            email: "maartenvandenbroek@gmail.com",
            weeks_delivered: "12",
            first_order_date: "9/29/21",
        },
        {
            email: "campospiera.elena@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/2/21",
        },
        {
            email: "andreuginer95@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/4/21",
        },
        {
            email: "anajmm@hotmail.com",
            weeks_delivered: "8",
            first_order_date: "10/4/21",
        },
        {
            email: "c.fontaine1@newcastle.ac.uk",
            weeks_delivered: "10",
            first_order_date: "10/3/21",
        },
        {
            email: "chirolacabanillas@gmail.com",
            weeks_delivered: "4",
            first_order_date: "10/4/21",
        },
        {
            email: "patrick.truempi@me.com",
            weeks_delivered: "7",
            first_order_date: "10/6/21",
        },
        {
            email: "shawn.p.anderson63@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/11/21",
        },
        {
            email: "vplaja@gmail.com",
            weeks_delivered: "4",
            first_order_date: "10/11/21",
        },
        {
            email: "shinobiswar@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/11/21",
        },
        {
            email: "azzi.ge@gmail.com",
            weeks_delivered: "10",
            first_order_date: "10/11/21",
        },
        {
            email: "arthur.geheniau@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/12/21",
        },
        {
            email: "casadevallaguilo@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/13/21",
        },
        {
            email: "haedenfura@gmail.com",
            weeks_delivered: "10",
            first_order_date: "10/13/21",
        },
        {
            email: "chenekoscielny@gmail.com",
            weeks_delivered: "9",
            first_order_date: "10/14/21",
        },
        {
            email: "imogennash@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/18/21",
        },
        {
            email: "bjornalmgren34@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/18/21",
        },
        {
            email: "pingodachina@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "10/19/21",
        },
        {
            email: "murielveenstra96@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/19/21",
        },
        {
            email: "crodriguezsirgado@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/20/21",
        },
        {
            email: "hanmcdermo@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/20/21",
        },
        {
            email: "lavirginia@gmail.com",
            weeks_delivered: "10",
            first_order_date: "10/21/21",
        },
        {
            email: "zapamon@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "10/22/21",
        },
        {
            email: "pal.gar89@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/22/21",
        },
        {
            email: "anonnymiss@hotmail.com",
            weeks_delivered: "9",
            first_order_date: "10/23/21",
        },
        {
            email: "paddy.synge@hotmail.co.uk",
            weeks_delivered: "6",
            first_order_date: "10/23/21",
        },
        {
            email: "weshenshall@gmail.com",
            weeks_delivered: "1",
            first_order_date: "10/24/21",
        },
        {
            email: "charlotte.biron111@gmail.com",
            weeks_delivered: "2",
            first_order_date: "10/25/21",
        },
        {
            email: "pjt1991@gmail.com",
            weeks_delivered: "9",
            first_order_date: "10/25/21",
        },
        {
            email: "claire.italien@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/25/21",
        },
        {
            email: "maparraj@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/26/21",
        },
        {
            email: "albatros.ivair@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/26/21",
        },
        {
            email: "christinaulfsparre299@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "10/26/21",
        },
        {
            email: "RDHEERAJ10@GMAIL.COM",
            weeks_delivered: "1",
            first_order_date: "10/26/21",
        },
        {
            email: "anoeks@gmail.com",
            weeks_delivered: "7",
            first_order_date: "10/26/21",
        },
        {
            email: "jimenezlopezarturo@gmail.com",
            weeks_delivered: "6",
            first_order_date: "10/27/21",
        },
        {
            email: "myriankatto@gmail.com",
            weeks_delivered: "8",
            first_order_date: "10/28/21",
        },
        {
            email: "cullennufc91@hotmail.com",
            weeks_delivered: "8",
            first_order_date: "10/28/21",
        },
        {
            email: "jackeline.gonzalesr@gmail.com",
            weeks_delivered: "3",
            first_order_date: "10/28/21",
        },
        {
            email: "ines.valverde16@gmail.com",
            weeks_delivered: "4",
            first_order_date: "10/31/21",
        },
        {
            email: "Gueri14@Hotmail.com",
            weeks_delivered: "2",
            first_order_date: "10/31/21",
        },
        {
            email: "juliaturuu19@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/1/21",
        },
        {
            email: "Lorenz.verv@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "11/1/21",
        },
        {
            email: "sandernina@hotmail.de",
            weeks_delivered: "1",
            first_order_date: "11/2/21",
        },
        {
            email: "bbhaase@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/2/21",
        },
        {
            email: "alfaro.an@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/3/21",
        },
        {
            email: "luisafernanda.toro@outlook.es",
            weeks_delivered: "2",
            first_order_date: "11/3/21",
        },
        {
            email: "gero_markowski@web.de",
            weeks_delivered: "2",
            first_order_date: "11/3/21",
        },
        {
            email: "dmagdalena364@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/4/21",
        },
        {
            email: "sarina.liptiay@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/4/21",
        },
        {
            email: "zac.sands@hotmail.co.uk",
            weeks_delivered: "8",
            first_order_date: "11/4/21",
        },
        {
            email: "navarijo@hotmail.com",
            weeks_delivered: "5",
            first_order_date: "11/5/21",
        },
        {
            email: "victor.el.aguila@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/6/21",
        },
        {
            email: "holly.bryce13@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/6/21",
        },
        {
            email: "hunabmc@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/6/21",
        },
        {
            email: "wfraberger@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/6/21",
        },
        {
            email: "nataliatatc@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/6/21",
        },
        {
            email: "mcgillk@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/6/21",
        },
        {
            email: "marta_jose_prado@hotmail.com",
            weeks_delivered: "6",
            first_order_date: "11/6/21",
        },
        {
            email: "holaaudreylellouche@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/7/21",
        },
        {
            email: "philippa.j.ross@gmail.com",
            weeks_delivered: "8",
            first_order_date: "11/7/21",
        },
        {
            email: "pamesilva504@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/21",
        },
        {
            email: "sandraborras13@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/21",
        },
        {
            email: "rmhortensius@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/21",
        },
        {
            email: "aziendemadeinsardegna@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/21",
        },
        {
            email: "ayelenchess@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/7/21",
        },
        {
            email: "mosen_1994@hotmail.com",
            weeks_delivered: "2",
            first_order_date: "11/8/21",
        },
        {
            email: "crisfur@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/8/21",
        },
        {
            email: "lovelaietax@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/11/21",
        },
        {
            email: "beus23@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/12/21",
        },
        {
            email: "adribaubar@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/12/21",
        },
        {
            email: "teresacanal@yahoo.es",
            weeks_delivered: "3",
            first_order_date: "11/12/21",
        },
        {
            email: "pevendramini@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/12/21",
        },
        {
            email: "alexhough96@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/13/21",
        },
        {
            email: "silvia.milamas@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/13/21",
        },
        {
            email: "caroline.astrom@fastighetsbyran.se",
            weeks_delivered: "2",
            first_order_date: "11/14/21",
        },
        {
            email: "mpp24912@gmail.com",
            weeks_delivered: "7",
            first_order_date: "11/15/21",
        },
        {
            email: "cjskim@gmail.com",
            weeks_delivered: "6",
            first_order_date: "11/16/21",
        },
        {
            email: "c.roca@hotmail.com",
            weeks_delivered: "1",
            first_order_date: "11/17/21",
        },
        {
            email: "viscun@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/17/21",
        },
        {
            email: "mherranzfo@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/17/21",
        },
        {
            email: "stewardess@mini-y.com",
            weeks_delivered: "6",
            first_order_date: "11/17/21",
        },
        {
            email: "howie.linda@aol.com",
            weeks_delivered: "2",
            first_order_date: "11/18/21",
        },
        {
            email: "diane.sicsic@icloud.com",
            weeks_delivered: "1",
            first_order_date: "11/18/21",
        },
        {
            email: "vackabcn@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/18/21",
        },
        {
            email: "pv.paolovitale@gmail.com",
            weeks_delivered: "3",
            first_order_date: "11/18/21",
        },
        {
            email: "eeb_04@hotmail.com",
            weeks_delivered: "3",
            first_order_date: "11/18/21",
        },
        {
            email: "anacosialls@hotmail.com",
            weeks_delivered: "6",
            first_order_date: "11/19/21",
        },
        {
            email: "saroca01@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/19/21",
        },
        {
            email: "luciachauveau@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/20/21",
        },
        {
            email: "lrobinson@whiskyinvestmentpartners.com",
            weeks_delivered: "3",
            first_order_date: "11/21/21",
        },
        {
            email: "bpankis@gmail.com",
            weeks_delivered: "1",
            first_order_date: "11/22/21",
        },
        {
            email: "tomstockell@hotmail.co.uk",
            weeks_delivered: "4",
            first_order_date: "11/23/21",
        },
        {
            email: "celinaresb@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/23/21",
        },
        {
            email: "andrew.lee.cooper@pm.me",
            weeks_delivered: "4",
            first_order_date: "11/24/21",
        },
        {
            email: "yolandacayuela@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "11/24/21",
        },
        {
            email: "sarah.smelik@gmail.com",
            weeks_delivered: "5",
            first_order_date: "11/26/21",
        },
        {
            email: "pinarello3@hotmail.com",
            weeks_delivered: "5",
            first_order_date: "11/26/21",
        },
        {
            email: "newanastas@gmail.com",
            weeks_delivered: "2",
            first_order_date: "11/26/21",
        },
        {
            email: "sorin.audrey35@gmail.com",
            weeks_delivered: "4",
            first_order_date: "11/28/21",
        },
        {
            email: "kalse_naomi@hotmail.com",
            weeks_delivered: "4",
            first_order_date: "11/30/21",
        },
        {
            email: "peptenaru.beatrice@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/1/21",
        },
        {
            email: "head.bcn@stgeorge.es",
            weeks_delivered: "2",
            first_order_date: "12/3/21",
        },
        {
            email: "theresa.tobollik@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/3/21",
        },
        {
            email: "noe29gp@gmail.com",
            weeks_delivered: "3",
            first_order_date: "12/5/21",
        },
        {
            email: "brichackova.adela@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/8/21",
        },
        {
            email: "nicorici.alexa@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/8/21",
        },
        {
            email: "therese.vanderheijden@avis.nl",
            weeks_delivered: "2",
            first_order_date: "12/10/21",
        },
        {
            email: "gvelsan@gmail.com",
            weeks_delivered: "3",
            first_order_date: "12/10/21",
        },
        {
            email: "domarackajustyna@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/11/21",
        },
        {
            email: "lesya.polyakova@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/13/21",
        },
        {
            email: "jennie.cowie@yahoo.co.uk",
            weeks_delivered: "3",
            first_order_date: "12/14/21",
        },
        {
            email: "henryollh205@gmail.com",
            weeks_delivered: "2",
            first_order_date: "12/19/21",
        },
        {
            email: "wisdompoet@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/24/21",
        },
        {
            email: "marctenblanco@gmail.com",
            weeks_delivered: "1",
            first_order_date: "12/25/21",
        },
    ],
};
