
const fs = require("fs");
const path = require("path");
const sizeOf = require("image-size");
const {
    Document: DocxDocument, 
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    ImageRun,
    WidthType,
    BorderStyle
} = require("docx");

const IMAGE_DIR = "./screenshoots";
const date = new Date();
const dateString = date.toISOString().split('T')[0];
const FileName = `./Reimbuse-${dateString}.docx`;

async function main() {
    const images = fs.readdirSync(IMAGE_DIR)
                    .filter(file => /\.(png|jpg|jpeg)$/i.test(file))
                    .map((file) => ({
                        file,
                        fullPath: path.join(IMAGE_DIR, file),
                    }))
                    .sort((a, b) => a.file.localeCompare(b.file));

    const row = [];
    

    console.log(images.length);


    for (let i = 0; i < images.length; i+=4) {

        const cells = [];

        for (let j = 0; j < 4; j++) {
            if (images[i + j]) {
                const img = images[i+j];                
                
                const buffer = fs.readFileSync(img.fullPath);

                const dimension = sizeOf.imageSize(buffer);

                cells.push(
                    new TableCell({
                        children: [
                            new Paragraph({
                                children: [
                                    new ImageRun({
                                        data: buffer,
                                        transformation: {
                                            width: 170,
                                            height: Math.round(
                                                dimension.height *
                                                (170 / dimension.width)
                                            )
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                )
            }
        }

         row.push(
            new TableRow({
                children: cells
            })
        );
    }   

    const doc = new DocxDocument({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 567,
                        right: 567,
                        bottom: 567,
                        left: 567
                    }
                }
            },
            children: [
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE
                    },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                    },
                    rows: row
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);

    fs.writeFileSync(FileName, buffer);

    console.log("Generated!");
}

main();



