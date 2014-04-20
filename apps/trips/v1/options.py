# -*- coding: utf-8 -*-
__author__ = 'art'
from apps.persons.v1.options import PersonOption

class TripOption():

    class relations:
        @staticmethod
        def getTripRelation():
            relations = {
                'likeusers': PersonOption.relations.getPersonShortRelation(),
                'author': PersonOption.relations.getPersonShortRelation(),
                'admins': PersonOption.relations.getPersonShortRelation(),
                'members': PersonOption.relations.getPersonShortRelation(),
                'reviews': {
                    'relations': {
                        'author': PersonOption.relations.getPersonShortRelation(),
                    }
                },
                'blocks': {
                    'relations': {
                        'points': {
                            'extras': ('type_of_item',),
                            'relations': {
                                'tags': {'fields': ('name', 'id', 'level')},
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'imgs': {
                                    'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560', 'thumbnail625x370'),
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation(),
                                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                                        'comments': {
                                            'relations': {
                                                'author': PersonOption.relations.getPersonShortRelation()
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'events': {
                            'relations': {
                                'tags': {'fields': ('name', 'id', 'level')},
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'imgs': {
                                    'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560','thumbnail625x370'),
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation(),
                                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                                        'comments': {
                                            'relations': {
                                                'author': PersonOption.relations.getPersonShortRelation()
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                        'imgs': {
                            'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560','thumbnail625x370'),
                            'relations': {
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'likeusers': PersonOption.relations.getPersonShortRelation(),
                                'comments': {
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation()
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return relations

        @staticmethod
        def getTripShortRelation():
            relations = {
                'likeusers': PersonOption.relations.getPersonShortRelation(),
                'author': PersonOption.relations.getPersonShortRelation(),
                'admins': PersonOption.relations.getPersonShortRelation(),
                'members': PersonOption.relations.getPersonShortRelation(),
                'blocks': {
                    'relations': {
                        'points': {
                            'relations': {
                                'tags': {'fields': ('name', 'id', 'level')},
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'imgs': {
                                    'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560','thumbnail625x370'),
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation(),
                                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                                        'comments': {
                                            'relations': {
                                                'author': PersonOption.relations.getPersonShortRelation()
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'events': {
                            'relations': {
                                'tags': {'fields': ('name', 'id', 'level')},
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'imgs': {
                                    'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560','thumbnail625x370'),
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation(),
                                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                                        'comments': {
                                            'relations': {
                                                'author': PersonOption.relations.getPersonShortRelation()
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                        'imgs': {
                            'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560','thumbnail625x370'),
                            'relations': {
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'likeusers': PersonOption.relations.getPersonShortRelation(),
                                'comments': {
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation()
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return relations

        @staticmethod
        def getTripSuperShotRelation():
            relations = {
                'likeusers': PersonOption.relations.getPersonShortRelation(),
                'author': PersonOption.relations.getPersonShortRelation(),
                'admins': PersonOption.relations.getPersonShortRelation(),
                'members': PersonOption.relations.getPersonShortRelation(),
                'blocks': {
                    'relations': {
                        'points': {
                            'relations': {
                                'tags': {'fields': ('name', 'id', 'level')},
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'imgs': {
                                    'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560','thumbnail625x370'),
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation(),
                                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                                        'comments': {
                                            'relations': {
                                                'author': PersonOption.relations.getPersonShortRelation()
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'events': {
                            'relations': {
                                'tags': {'fields': ('name', 'id', 'level')},
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'imgs': {
                                    'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560','thumbnail625x370'),
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation(),
                                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                                        'comments': {
                                            'relations': {
                                                'author': PersonOption.relations.getPersonShortRelation()
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        'likeusers': PersonOption.relations.getPersonShortRelation(),
                        'imgs': {
                            'extras': ('thumbnail104x104', 'thumbnail207', 'thumbnail560', 'thumbnail625x370'),
                            'relations': {
                                'author': PersonOption.relations.getPersonShortRelation(),
                                'likeusers': PersonOption.relations.getPersonShortRelation(),
                                'comments': {
                                    'relations': {
                                        'author': PersonOption.relations.getPersonShortRelation()
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return relations

    class extras:
        pass
