# -*- coding: utf-8 -*-
__author__ = 'art'

class PersonOption:


    class relations:
        @staticmethod
        def getPersonShortRelation():
            return {'fields': ('first_name', 'last_name', 'avatar')}