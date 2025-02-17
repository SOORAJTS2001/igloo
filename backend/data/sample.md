```python
class PropertyModel:
    property_categories = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    segment_categories = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    location_categories = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    architectural_styles = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    unit_of_measure = LazyReferenceField(OpenTravelAllianceCodeModel)
    amenities = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    breakfast_options = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    status = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyDescriptionEmbeddedDocument(EmbeddedDocument):
    info_code = LazyReferenceField(OpenTravelAllianceCodeModel)
    additional_detail_type = LazyReferenceField(OpenTravelAllianceCodeModel)

class ImageEmbeddedDocument(EmbeddedDocument):
    category = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyNearByAttractionEmbeddedDocument(EmbeddedDocument):
    category = LazyReferenceField(OpenTravelAllianceCodeModel)
    unit_of_measure = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyPointOfReferenceEmbeddedDocument(EmbeddedDocument):
    unit_of_measure = LazyReferenceField(OpenTravelAllianceCodeModel)
    index_point = LazyReferenceField(OpenTravelAllianceCodeModel)
    ref_point_category = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyRecreationEmbeddedDocument(EmbeddedDocument):
    proximity = LazyReferenceField(OpenTravelAllianceCodeModel)
    code = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyRestaurantEmbeddedDocument(EmbeddedDocument):
    categories = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    cuisines = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    proximity = LazyReferenceField(OpenTravelAllianceCodeModel)
    services = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    dietary_options = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))

class PropertyServiceEmbeddedDocument(EmbeddedDocument):
    code = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyContactInfoAddressEmbeddedDocument(EmbeddedDocument):
    use_type = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyContactInfoEmbeddedDocument(EmbeddedDocument):
    location = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyContactInfoPhoneEmbeddedDocument(EmbeddedDocument):
    phone_tech_type = LazyReferenceField(OpenTravelAllianceCodeModel)
    phone_use_type = LazyReferenceField(OpenTravelAllianceCodeModel)
    phone_location = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyGuestRoomInfoEmbeddedDocument(EmbeddedDocument):
    code = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyGuestRoomEmbeddedDocument(EmbeddedDocument):
    bed_type = LazyReferenceField(OpenTravelAllianceCodeModel, required=True)
    classification = LazyReferenceField(OpenTravelAllianceCodeModel)
    category = LazyReferenceField(OpenTravelAllianceCodeModel)
    architecture = LazyReferenceField(OpenTravelAllianceCodeModel)
    amenities = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    location = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyGuestRoomSizeEmbeddedDocument(EmbeddedDocument):
    unit = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyMeetingRoomCapacityEmbeddedDocument(EmbeddedDocument):
    meeting_room_format = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyMeetingRoomDimensionEmbeddedDocument(EmbeddedDocument):
    unit_of_measure = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyMeetingRoomsEmbeddedDocument(EmbeddedDocument):
    unit_of_measure = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyPoliciesEmbeddedDocument(EmbeddedDocument):
    info_code = LazyReferenceField(OpenTravelAllianceCodeModel)
    additional_detail_type = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyTaxModel(DynamicEmbeddedDocument):
    code = LazyReferenceField(OpenTravelAllianceCodeModel)
    charge_unit = LazyReferenceField(OpenTravelAllianceCodeModel)
    charge_frequency = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyPetPolicyModel(EmbeddedDocument):
    pet_policy = LazyReferenceField(OpenTravelAllianceCodeModel)
    unit_of_measure = LazyReferenceField(OpenTravelAllianceCodeModel)
    charge_code = LazyReferenceField(OpenTravelAllianceCodeModel)

class PropertyPetPoliciesAllowedCodeModel(EmbeddedDocument):
    allowed = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    not_allowed = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    assistive_animals_only = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
    by_arrangements = ListField(LazyReferenceField(OpenTravelAllianceCodeModel))
