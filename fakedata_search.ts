import { Client } from '@elastic/elasticsearch';
import{BulkOperationContainer, BulkResponse} from '@elastic/elasticsearch/lib/api/types';
import {faker} from '@faker-js/faker';

// Create an Elasticsearch client
const client = new Client({ node: 'http://localhost:9200' });

// Function to generate fake medical patient data
function generateFakeMedicalPatients(count:number) {
    const patients = [];
    for (let i = 0; i < count; i++) {
        const patient = {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            age: faker.number.bigInt({ min: 18, max: 100 }).toString(),
            gender: faker.helpers.arrayElement(['Male', 'Female']),
            bloodType: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            medicalHistory: faker.lorem.paragraph(),
            contact: {
                email: faker.internet.email(),
                phone: faker.phone.number(),
                address: {
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    country: faker.location.country(),
                    zipcode: faker.location.zipCode()
                }
            }
        };
        patients.push(patient);
    }
    return patients;
}

// Function to add medical patient data to Elasticsearch
async function addMedicalPatientsToElasticsearch(patients) {
    try {
        const bulkBody:BulkOperationContainer | any = patients.flatMap(patient => [
            { index: { _index: 'medical_patients', _id: patient.id } },
            patient
        ]);

        const  bulkResponse:BulkResponse  = await client.bulk({ refresh: true, operations:bulkBody });

        if (bulkResponse.errors) {
            console.error('Failed to add data to Elasticsearch:', bulkResponse.errors);
        } else {
            console.log('Data added successfully to Elasticsearch.');
        }
    } catch (error) {
        console.error('Error adding data to Elasticsearch:', error);
    }
}

// Generate 100_000 fake medical patient records
const fakeMedicalPatients = generateFakeMedicalPatients(100_000);

// Add fake medical patient data to Elasticsearch
addMedicalPatientsToElasticsearch(fakeMedicalPatients);
