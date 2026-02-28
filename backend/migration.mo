import Map "mo:core/Map";

module {
  type OldActor = {
    environmentVariables : Map.Map<Text, Text>;
  };

  type NewActor = {};

  public func run(old : OldActor) : NewActor {
    old.environmentVariables.clear();
    {};
  };
};
