#!/usr/env/python

import json
from collections import OrderedDict
from contextlib import contextmanager

MAP_GEOJSON_FILENAME = "web/geojson/auckland_liquor_ban.geojson"
FILTER_PROPERTIES = 'BYLAWTITLE BYLAWAREAN HOURSOFOPE COUNCILDEC'.split()

# mapping to normalise the HOURSOFOPE property.
# if the values change, also update the JS that uses them to choose colours
HOURSOFOPE_ENUM = {
    '24 hours, 7 days a week': "24x7",

    '3pm to 7am daily': "3pm_to_7am",

    '7pm to 7am daily': "7pm_to_7am",
    '7pm to 7am daily, daylight savings only': "7pm_to_7am_dst",
    'Holiday (7pm to 7am daily from Friday of Labour weekend to Tuesday of Easter)': "7pm_to_7am_summer", 

    '9pm to 7am during daylight savings and 7pm to 7am outside daylight savings': "9pm_to_7am_dst_7pm_to_7am_nodst", 
    '9pm to 7am during daylight saving and 7pm to 7am outside daylight saving': "9pm_to_7am_dst_7pm_to_7am_nodst", 
    '9pm to 7am daily, daylight saving only': "9pm_to_7am_dst",

    '10pm to 7am during daylight saving and 7pm to 7am outside daylight saving': "10pm_to_7am_dst_7pm_to_7am_nodst",

    'At all hours of the day on the Market Days of the annual Kowhai Festival each year': "special_warkworth_kowhai",
    'Major Event: 12 hours before & after a major event.': "special_eden_park",
    'Second weekend of each December from 4pm of the Friday before the event (Christmas in the Park) to 8am on the following Monday': "special_xmas_in_the_park"
}


@contextmanager
def short_float_patch():
    """
    Monkey patch JSON encoding of float, to reduce GeoJSON size
    from https://stackoverflow.com/questions/1447287/format-floats-with-standard-json-module/1447581#1447581
    """
    from json import encoder
    original_float_repr = encoder.FLOAT_REPR
    encoder.FLOAT_REPR = lambda o: format(o, '.5f')

    try:
        yield
    finally:
        encoder.FLOAT_REPR = original_float_repr


def squash_geojson():
    with open(MAP_GEOJSON_FILENAME) as f:
        map_geojson = json.load(f, object_pairs_hook=OrderedDict)


    with open(MAP_GEOJSON_FILENAME, 'w') as f:
        with short_float_patch():
            # remove space after comma to save space, added newline after: to make diffs readable
            json.dump(map_geojson, f, separators=(',', ':\n'))


def preprocess_geojson():
    with open(MAP_GEOJSON_FILENAME) as f:
        map_geojson = json.load(f, object_pairs_hook=OrderedDict)

        out_features = []

        for feature in map_geojson['features']:
            if feature['properties'].get('BYLAWSTATU', 'Current') != 'Current':
                print "Non-current feature found, skipping: ", json.dumps(feature)
                continue

            out_feature = feature

            for k in feature['properties']:
                if k not in FILTER_PROPERTIES:
                    del out_feature['properties'][k]

            out_feature['properties']['HOURSOFOPE_ENUM'] = HOURSOFOPE_ENUM[out_feature['properties']['HOURSOFOPE']]
                
            out_features.append(out_feature)

        map_geojson['features'] = out_features

    with open(MAP_GEOJSON_FILENAME, 'w') as f:
        json.dump(map_geojson, f)


if __name__ == '__main__':
    preprocess_geojson()
    squash_geojson()
