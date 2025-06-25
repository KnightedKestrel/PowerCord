import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkLatestUpdate } from '../data/csvDownloader';

// Mocking https://openpowerlifting.gitlab.io/opl-csv/bulk-csv.html
const statusPage = `
<html>
    <body>
        <div id="body-container">
            <div id="page-wrapper">
                <div class="page">
                    <div id="content">
                        <main>
                            <h1>
                                <a class="header" href="#"
                                    >Bulk CSV Downloads</a
                                >
                            </h1>
                            <ul>
                                <li>Updated: 2001-01-01.</li>
                                <li>
                                    Revision:
                                    <a href="#">abcd1234</a>.
                                </li>
                            </ul>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
`;

describe('csvDownloader', () => {
    beforeEach(() => {
        vi.spyOn(axios, 'get').mockImplementation(vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should get the date off the status page', async () => {
        vi.mocked(axios.get).mockResolvedValue({
            data: statusPage,
        });
        const date = await checkLatestUpdate();

        expect(date).toBe('2001-01-01');
    });
});
