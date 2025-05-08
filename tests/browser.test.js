const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');
const path = require('path');
const firefox = require('selenium-webdriver/firefox');

// Sätter sökvägen till geckodriver explicit för att undvika problem med PATH-variabeln
const geckoDriverPath = path.resolve(__dirname, '../geckodriver.exe');
const options = new firefox.Options();
options.setBinary('C:/Program Files/Mozilla Firefox/firefox.exe');


// Här anger vi var testfilen ska hämtas. De konstiga replaceAll-funktionerna ersätter
// mellanslag med URL-säkra '%20' och backslash (\) på Windows med slash (/).
const fileUnderTest = 'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';
const defaultTimeout = 30000; 
let driver;

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
    console.log('Running browser tests on:', fileUnderTest);
    console.log('Using geckodriver at:', geckoDriverPath);
    try {
        // skapar en ny instans av Firefox med geckodriver och öppnar testfilen
        const service = new firefox.ServiceBuilder(geckoDriverPath);
        driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .setFirefoxService(service)
            .build();
        await driver.get(fileUnderTest);
        console.log('Browser initialized successfully');
    } catch (error) {
        console.error('Error during setup:', error);
        throw error;
    }
}, defaultTimeout);

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    try {
        if (driver) {
            console.log('Shutting down browser');
            await driver.quit();
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
    try {
        console.log('Running test: stack should be empty');
        let stack = await driver.findElement(By.id('top_of_stack')).getText();
        expect(stack).toEqual("n/a");
    } catch (error) {
        console.error('Error during "stack should be empty" test:', error);
        throw error;
    }
}, defaultTimeout);

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        try {
            console.log('Running test: push button functionality');
            let push = await driver.findElement(By.id('push'));
            await push.click();
            let alert = await driver.switchTo().alert();
            await alert.sendKeys("Bananer");
            await alert.accept();
            
            let stack = await driver.findElement(By.id('top_of_stack')).getText();
            expect(stack).toEqual("Bananer");
        } catch (error) {
            console.error('Error during "push button" test:', error);
            throw error;
        }
    }, defaultTimeout);
});
// mina tester
describe('Clicking "Poppa stacken!"', () => {
    it('should remove the top element and show an alert', async () => {
        try {
            console.log('Running test: pop button functionality');
            
            // First så lägger vi till ett värde i stacken för att säkerställa att det finns något att poppa
            let push = await driver.findElement(By.id('push'));
            await push.click();
            let pushAlert = await driver.switchTo().alert();
            await pushAlert.sendKeys("TestValue");
            await pushAlert.accept();
            
            // Kolla att stacken innehåller det värde vi just lagt till
            let stackBefore = await driver.findElement(By.id('top_of_stack')).getText();
            expect(stackBefore).toEqual("TestValue");
            
            // Nu ska vi poppa stacken
            let pop = await driver.findElement(By.id('pop'));
            await pop.click();
            
            // kolla att alerten dyker upp och att den innehåller rätt text
            let popAlert = await driver.switchTo().alert();
            let alertText = await popAlert.getText();
            expect(alertText).toContain("Tog bort TestValue");
            await popAlert.accept();
            
            // Stacken ska gå tillbaka till det värde vi hade innan vi poppade
            let stackAfter = await driver.findElement(By.id('top_of_stack')).getText();
            expect(stackAfter).toEqual("Bananer");
        } catch (error) {
            console.error('Error during "pop button" test:', error);
            throw error;
        }
    }, defaultTimeout);
});
