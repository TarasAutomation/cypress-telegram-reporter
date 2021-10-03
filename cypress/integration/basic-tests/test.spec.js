describe('Basic Test Suite', () => {
    it('Passed Test', () => {
        expect(true).to.eq(true);
    })

    it('Failed Test', () => {
        expect(true).to.eq(false);
    })

    it.skip('Skipped Test', () => {
        expect('Whatever').to.eq('Anything');
    })
})