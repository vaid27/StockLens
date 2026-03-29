import yfinance as yf
import sys
from datetime import datetime

symbols = ['AAPL', 'AMZN', 'SOL-USD', 'BTC-USD', 'ETH-USD', 'GOOGL', 'MSFT']
print('Testing yfinance directly:')
print('Current date: ' + datetime.now().strftime('%Y-%m-%d'))
print('')

for sym in symbols:
    try:
        ticker = yf.Ticker(sym)
        hist = ticker.history(period='1d')
        if not hist.empty:
            price = float(hist['Close'].iloc[-1])
            print(f'OK - {sym}: ${price:.2f}')
        else:
            print(f'NO - {sym}: No data returned')
    except Exception as e:
        print(f'ERROR - {sym}: {str(e)[:80]}')

