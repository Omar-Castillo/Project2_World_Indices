from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import pandas as pd
import json

#this part of the code runs if we are on Heroku
if os.environ.get('DATABASE_URL'):
    url = os.environ.get('DATABASE_URL')
#this part of our code runs on local
else:
    import config
    url = config.url
    print(config.url)


def create_app():
    app = Flask(
        __name__,
        static_folder='static',
        static_url_path='',
        template_folder='templates'
    )
    app.config['SQLALCHEMY_DATABASE_URI'] = url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    #helps with caching
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


    db = SQLAlchemy(app)
    engine = db.get_engine()

    @app.route('/')
    def index():
        return render_template('./index.html')

    @app.route('/data')
    def world_data():
        # Use Pandas to perform the sql query
        years_data = pd.read_sql_query('select * from world_indices',engine)
        # years_data = years_data.to_json(orient='records')

        #create a list comprehension for the range for values, need to make sure range captures all the years
        years_columns =[str(x) for x in (range(1960,2018))]

        #using pandas pivot to make better organize our original data
        new_table = pd.pivot_table(years_data, values=years_columns, index= ['CountryName'], columns=["Index"])

        # use code below to create new columns that combine multi index
        final_columns = [' '.join(col).strip() for col in new_table.columns.values]

        #set our new table columns to the final columns created above, and set to json
        new_table.columns= final_columns

        return new_table.reset_index().to_json(orient='records')

    

        # Return a list of the column names (Years Data)
        # return jsonify(json.loads(years_data))
    
    @app.route('/population_data')
    def population_data():
        population_data = pd.read_sql_query('select * from world_population', engine)
        population_data = population_data.to_json(orient='records')
        return jsonify(json.loads(population_data))

    return app


app = create_app()

if __name__ == '__main__':
    app.run()