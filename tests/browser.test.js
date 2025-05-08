const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

// Här anger vi var testfilen ska hämtas. De konstiga replaceAll-funktionerna ersätter
// mellanslag med URL-säkra '%20' och backslash (\) på Windows med slash (/).
const fileUnderTest = 'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';
const defaultTimeout = 30000; 
let driver;

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
    console.log('Running browser tests on:', fileUnderTest);
    try {
        driver = await new Builder().forBrowser('firefox').build();
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
