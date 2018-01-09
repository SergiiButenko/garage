import requests
import json
import logging
import time

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.DEBUG)

BACKEND = 'http://butenko.asuscomm.com:7642'


def check_status():
    try:
        response = requests.get(BACKEND + '/status')
        response.raise_for_status()
        logging.debug('response {0}'.format(response.text))

        resp = json.loads(response.text)['branches']
        return resp
    except Exception as e:
        logging.error(e)
        logging.error("Can't get status from backend")

if __name__ == "__main__":
    while True:
        check_status()
        time.sleep(300)
